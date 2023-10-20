import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import api from "../api/api";
import pathUtil from "../state/path";
import util from "../core/ui/util";
import Button from "../core/ui/button";
import FileBrowser from "../core/ui/file-browser";
import FileDropZone from "../core/ui/file-drop-zone";
import FileView from "../core/ui/file-view";
import Dropdown from "../core/ui/dropdown";
import MultiFileView from "../core/ui/multi-file-view";
import FileUploader from "../core/ui/file-uploader";
import Breadcrumbs from "../core/ui/breadcrumbs";
import DirectoryTree from "../core/ui/directory-tree";
import i18n from "../util/i18n";
import str from "../util/str";
import DirectoryView from "../core/ui/directory-view";
import RootDirectoryView from "../core/ui/root-directory-view";
import MediaViewSwitcher from "../core/ui/media-view-switcher";

function ViewMediaDirectory(props) {

    const [state, setState] = useState({
        isLoading: true,
        currentFile: null,
        selectedFiles: [],
        selectedFileIds: [],
        directoryPath: []
    });

    const location = useSelector(state => state.location);
    const { isInitialised, viewMode, path, directory, directories, files } = useSelector(state => state.media);
    const dispatch = useDispatch();

    useEffect(() => {
        if (location.current.params.directory) {
            load(location.current.params.directory);
            return;
        }
        load();
    }, [location]);

    const load = async (directoryId = null) => {
        await axios.all([
            api.media.path(directoryId),
            api.media.loadDirectories(directoryId),
            api.media.loadFiles(directoryId)
        ]).then(axios.spread((response1, response2, response3) => {

            const path = response1.data.data;
            const directories = response2.data.data;
            const files = response3.data.data;
            const directory = path[path.length - 1];

            dispatch({ type: 'media/init', payload: {directory, path, directories, files}});

            setState({
                ...state,
                isLoading: false,

                // We also clear the selected file(s)
                currentFile: null,
                selectedFiles: [],
                selectedFileIds: []
            });
        }));
    }

    const refresh = () => {
        if (location.current.params.directory) {
            load(location.current.params.directory);
            return;
        }
        load();
    }

    const openDirectory = (id = null) => {
        if (id) {
            pathUtil.goTo(location.current.module, location.current.action, {
                directory: id
            });
            return;
        }

        pathUtil.goTo(location.current.module, location.current.action);
    }

    const clearSelection = () => {
        setState({
            ...state,
            currentFile: null,
            selectedFiles: [],
            selectedFileIds: []
        });
    };

    const handleSelectionChange = (selectedFileIds, selectedFiles) => {
        if (! selectedFiles.length) {

            clearSelection();

        } else if (selectedFiles.length === 1) {

            setState({
                ...state,
                currentFile: selectedFiles[0],
                selectedFiles: selectedFiles,
                selectedFileIds: selectedFileIds
            });

        } else {

            setState({
                ...state,
                currentFile: null,
                selectedFiles: selectedFiles,
                selectedFileIds: selectedFileIds
            });
        }
    }

    const handleDeleteDirectory = async (directoryId) => {
        try {
            await api.media.deleteDirectory(directoryId);
            dispatch({ type: 'media/directories/delete', directoryIds: [directoryId]});
            util.i18nNotify('snippets.directory_deleted');
            clearSelection();
        } catch (error) {
            util.i18nNotify('snippets.directory_not_deleted');
        }
    }

    const handleRenameDirectory = async (name, directoryId) => {
        if (name) {
            try {
                const response = await api.media.renameDirectory(name, directoryId);
                dispatch({ type: 'media/directories/rename', payload: response.data.data});
                util.i18nNotify('snippets.directory_renamed');
                clearSelection();
            } catch (error) {
                util.i18nNotify('snippets.changes_unsuccessful');
            }
        }
    }

    const handleRenameFile = async (name, fileId) => {
        if (name) {
            try {
                const response = await api.media.renameFile(name, fileId);
                dispatch({ type: 'media/files/rename', payload: response.data.data});
                util.i18nNotify('snippets.file_renamed');
            } catch (error) {
                util.i18nNotify('snippets.changes_unsuccessful');
            }
        }
    }

    const handleDeleteFile = async (fileId) => {
        try {
            await api.media.deleteFile(fileId);
            dispatch({ type: 'media/files/delete', fileIds: [fileId] });
            util.i18nNotify('snippets.file_deleted');
            clearSelection();
        } catch (error) {
            util.notify(i18n.get('snippets.file_not_deleted'));
        }
    }

    const handleDeleteFiles = async (fileIds) => {
        try {
            await api.media.deleteFiles(fileIds);
            dispatch({ type: 'media/files/delete', fileIds: fileIds });
            util.i18nNotify('snippets.amount_files_deleted', {amount: fileIds.length});
            clearSelection();
        } catch (error) {
            util.i18nNotify('snippets.files_not_deleted');
        }
    }

    const handleLabelFile = async (label, fileId) => {
        try {
            await api.media.labelFile(label, fileId);
            dispatch({ type: 'media/files/label', fileId, label });
            util.i18nNotify('snippets.changes_successful');
        } catch (error) {
            util.i18nNotify('snippets.changes_unsuccessful');
        }
    }

    const handleChangeFileProperty = async (property, value, fileId) => {
        property = property.toLowerCase();
        if (['visibility', 'description', 'copyright'].includes(property)) {
            const apiCall = api.media['updateFile'+str.toUpperCaseFirst(property)];
            try {
                await apiCall(value, fileId);
                dispatch({ type: 'media/files/changeProperty', fileId, property, value });
                util.notify(i18n.get('snippets.changes_successful'));
            } catch(error) {
                util.notify(i18n.get('snippets.changes_unsuccessful'));
            }
        }
    }

    const handleChangeFilesProperty = async (property, value, fileIds) => {
        property = property.toLowerCase();
        if (['visibility', 'description', 'copyright'].includes(property)) {
            const apiCall = api.media['updateFiles'+str.toUpperCaseFirst(property)];
            try {
                await apiCall(value, fileIds);
                dispatch({ type: 'media/files/changeProperties', fileIds, property, value });
                util.notify(i18n.get('snippets.changes_successful'));
            } catch(error) {
                util.notify(i18n.get('snippets.changes_unsuccessful'));
            }
        }
    }

    const handleMoveDirectory = async (moveToId, directoryId) => {
        try {
            await api.media.moveDirectory(moveToId, directoryId);
            dispatch({ type: 'media/directories/move', moveToId, directoryIds: [directoryId] });
            util.notify(i18n.get('snippets.directory_moved'));
        } catch (error) {
            util.notify(i18n.get('snippets.changes_unsuccessful'));
        }
    }

    const handleMoveFile = async (moveToId, fileId) => {
        try {
            await api.media.moveFile(moveToId, fileId);
            dispatch({ type: 'media/files/move', moveToId, fileIds: [fileId] });
            util.notify(i18n.get('snippets.file_moved'));
        } catch (error) {
            util.notify(i18n.get('snippets.changes_unsuccessful'));
        }
    }

    const handleMoveFiles = async (moveToId, fileIds) => {
        try {
            await api.media.moveFiles(moveToId, fileIds);
            dispatch({ type: 'media/files/move', moveToId, fileIds });
            util.notify(i18n.get('snippets.files_moved'));
        } catch (error) {
            util.notify(i18n.get('snippets.changes_unsuccessful'));
        }
    }

    const handleOpenFile = file => {
        window.open(file.url);
    }

    const handleUploadDone = () => {
        refresh();
    }

    const handleCreateDirectory = directory => {
        if (
            (! location.current.params.directory && ! directory.directory) ||
            (
                (directory.directory && location.current.params.directory) &&
                (directory.directory.id === location.current.params.directory)
            )
        ) {
            refresh();
        }
    }

    const promptCreateDirectory = () => {
        util.prompt({
            title: i18n.get('snippets.new_directory_title'),
            confirmButtonText: i18n.get('snippets.create'),
            cancelButtonText: i18n.get('snippets.cancel'),
            confirm: async (directoryName) => {
                const response = await api.media.createDirectory(directoryName, location.current.params.directory);
                dispatch({ type: 'media/directories/add', payload: response.data.data });
                util.notify(i18n.get('snippets.directory_created'));
            }
        });
    }

    const confirmDeleteFiles = (ids, files) => {
        util.confirm({
            title: i18n.get('snippets.delete_files_title', {amount: ids.length}),
            text: i18n.get('snippets.delete_files_text'),
            confirmButtonText: i18n.get('snippets.delete_files_confirm', {amount: ids.length}),
            cancelButtonText: i18n.get('snippets.delete_files_cancel'),
            confirm: () => handleDeleteFiles(ids)
        });
    }

    const renderBreadcrumbs = () => {
        return (
            <Breadcrumbs
                items={path}
                onClick={item => {
                    if (item) {
                        openDirectory(item.id);
                        return;
                    }
                    openDirectory();
                }}
            />
        );
    }

    const renderSidebar = () => {
        if (state.currentFile) {
            return (
                <FileView
                    file={state.currentFile}
                    fileLabels={props.fileLabels}
                    onLabelFile={label => handleLabelFile(label, state.currentFile.id)}
                    onChangeFileProperty={(property, value) => handleChangeFileProperty(property, value, state.currentFile.id)}
                    onDeleteFile={() => {
                        util.confirm({
                            title: i18n.get('snippets.delete_file_title'),
                            text: i18n.get('snippets.delete_file_text'),
                            confirmButtonText: i18n.get('snippets.delete_file_confirm'),
                            cancelButtonText: i18n.get('snippets.delete_file_cancel'),
                            confirm: () => handleDeleteFile(state.currentFile.id)
                        });
                    }}
                    onRenameFile={() => {
                        util.prompt({
                            title: i18n.get('snippets.rename_file_title'),
                            defaultValue: state.currentFile.name,
                            confirmButtonText: i18n.get('snippets.rename_file_confirm'),
                            cancelButtonText: i18n.get('snippets.rename_file_cancel'),
                            confirm: value => {
                                api.media.renameFile(value, state.currentFile.id).then(response => {
                                    setState({
                                        ...state,
                                        currentFile: response.data.data
                                    }, () => {
                                        util.notify(i18n.get('snippets.file_renamed'));
                                        refresh();
                                    });
                                });
                            }
                        });
                    }}
                    onMoveFile={handleMoveFile}
                />
            );
        } else if (state.selectedFiles.length) {
            return (
                <MultiFileView
                    files={state.selectedFiles}
                    onDeleteFiles={() => confirmDeleteFiles(state.selectedFileIds, state.selectedFiles)}
                    onChangeFilesProperty={(property, value) => handleChangeFilesProperty(property, value, state.selectedFileIds)}
                    onMoveFiles={handleMoveFiles}
                />
            );
        } else if (directory) {
            return <DirectoryView directory={directory} />;
        }

        return <RootDirectoryView />;
    }

    const renderContent = () => {
        return (
            <>
                <div className={'view-media-directory__main'}>
                    <FileDropZone
                        directory={directory ? directory.id : null}
                        onCreateDirectory={handleCreateDirectory}
                        onUploadDone={handleUploadDone}
                    >
                        <FileBrowser
                            viewMode={viewMode}
                            currentDirectory={directory}
                            directories={directories}
                            files={files}
                            fileLabels={props.fileLabels}
                            selectedFiles={state.selectedFiles}
                            selectedFileIds={state.selectedFileIds}

                            onDirectoryClick={openDirectory}
                            onDirectoryDelete={handleDeleteDirectory}
                            onDirectoryRename={handleRenameDirectory}
                            onDirectoryMove={handleMoveDirectory}

                            onFileDelete={handleDeleteFile}
                            onFileRename={handleRenameFile}
                            onFileOpen={handleOpenFile}
                            onFileMove={handleMoveFile}
                            onSelectionMove={handleMoveFiles}

                            onSelectionChange={handleSelectionChange}
                            onSelectionDelete={confirmDeleteFiles}
                        />
                    </FileDropZone>
                </div>
                <div className="view-media-directory__side">
                    {renderSidebar()}
                </div>
            </>
        );
    }

    const render = () => {
        return (
            <div className={'view-media-directory'+(state.isLoading ? ' view-media-directory--loading' : '')+(state.isDragOver ? ' view-media-directory--drag-over' : '')}>
                <div className="view-media-directory__header">
                    <div className="view-media-directory__header-title">
                        <Dropdown style={['primary', 'small']} openIcon={'folder'} closeIcon={'folder'}>
                            <DirectoryTree
                                selectedDirectory={directory ? directory.id : null}
                                onDirectoryClick={directory => openDirectory(directory)}
                            />
                        </Dropdown>
                        {renderBreadcrumbs()}
                    </div>
                    <div className="view-media-directory__header-options">
                        <MediaViewSwitcher />
                        <Button
                            style={['secondary', 'small']}
                            onClick={promptCreateDirectory}
                            text={i18n.get('snippets.new_directory')}
                        />
                        <Dropdown
                            text={i18n.get('snippets.upload')}
                            style={['primary', 'small']}
                            autoClose={true}
                        >
                            <FileUploader
                                directory={directory ? directory.id : null}
                                onUploadDone={handleUploadDone}
                            />
                        </Dropdown>
                    </div>
                </div>
                <div className="view-media-directory__content">
                    {state.isLoading ? null : renderContent()}
                </div>
            </div>
        );
    }

    return render();
}

ViewMediaDirectory.defaultProps = {
    type: '',
    path: {},
    id: 0,
    data: {},
    fileLabels: {}
};

export default ViewMediaDirectory;
