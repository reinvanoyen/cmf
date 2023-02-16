import React, {useEffect, useState} from 'react';
import axios from "axios";
import api from "../../api/api";
import FileBrowser from "./file-browser";
import Button from "./button";
import IconButton from "./icon-button";
import File from "./file";
import Breadcrumbs from "./breadcrumbs";
import Dropdown from "./dropdown";
import FileUploader from "./file-uploader";
import util from "./util";
import ContextMenu from "./context-menu";
import Placeholder from "./placeholder";
import DirectoryTree from "./directory-tree";
import Window from "./window";
import StickySidebar from "./sticky-sidebar";
import i18n from "../../util/i18n";
import FileDropZone from "./file-drop-zone";
import MediaViewSwitcher from "./media-view-switcher";
import useOnMount from "../../hooks/use-on-mount";

function FilePickerWidget(props) {

    const [state, setState] = useState({
        isLoading: true,
        directories: [],
        files: [],
        directoryPath: [],
        currentDirectory: null,
        selectedFileIds: props.defaultSelectedFileIds || [],
        selectedFiles: props.defaultSelectedFiles || []
    });

    useOnMount(() => {
        if (props.defaultDirectoryId) {
            load(props.defaultDirectoryId);
            return;
        }

        load();
    });

    useEffect(() => {
        props.onSelectionChange(state.selectedFileIds, state.selectedFiles);
    }, [state.selectedFileIds, state.selectedFiles]);

    const load = async (directoryId = null) => {

        await axios.all([
            api.media.path(directoryId),
            api.media.loadDirectories(directoryId),
            api.media.loadFiles(directoryId)
        ]).then(axios.spread((response1, response2, response3) => {

            let path = response1.data.data;
            let directories = response2.data.data;
            let files = response3.data.data;

            setState({
                ...state,
                isLoading: false,
                directoryPath: path,
                currentDirectory: path[path.length - 1],
                directories: directories,
                files: files
            });
        }));
    }

    const onSelectionChange = (ids, files) => {
        setState({
            ...state,
            selectedFileIds: ids,
            selectedFiles: files
        });
        props.onSelectionChange(ids, files);
    }

    const onSelectionConfirm = () => {
        props.onSelectionConfirm(state.selectedFileIds, state.selectedFiles);
    }

    const deselect = (id) => {

        let fileIds = state.selectedFileIds.filter(fileId => fileId !== id);
        let files = state.selectedFiles.filter(currFile => currFile.id !== id);

        setState({
            ...state,
            selectedFileIds: fileIds,
            selectedFiles: files
        });
    }

    const select = (file) => {
        setState({
            ...state,
            selectedFileIds: [...state.selectedFileIds, file.id],
            selectedFiles: [...state.selectedFiles, file]
        });
    }

    const onCancel = () => {
        props.onCancel();
    }

    const openDirectory = (directoryId) => {
        load(directoryId);
    }

    const handleUploadDone = () => {
        util.i18nNotify('snippets.files_uploaded');
        load((state.currentDirectory ? state.currentDirectory.id : null));
    }

    const handleFileUploaded = (file) => {
        select(file);
    }

    const handleCreateDirectory = () => {
        load((state.currentDirectory ? state.currentDirectory.id : null));
    }

    const handleRenameFile = (name, fileId) => {
        if (name) {
            api.media.renameFile(name, fileId).then(response => {
                util.i18nNotify('snippets.file_renamed');
                load((state.currentDirectory ? state.currentDirectory.id : null));
            }, error => {
                util.i18nNotify('snippets.changes_unsuccessful');
            });
        }
    }

    const handleRenameDirectory = (name, directoryId) => {
        if (name) {
            api.media.renameDirectory(name, directoryId).then(response => {
                util.i18nNotify('snippets.directory_renamed');
                load((state.currentDirectory ? state.currentDirectory.id : null));
            }, error => {
                util.i18nNotify('snippets.changes_unsuccessful');
            });
        }
    }

    const handleMoveSelection = (directoryId, fileIds) => {
        api.media.moveFiles(directoryId, fileIds).then(response => {
            util.i18nNotify('snippets.files_moved');
            load((state.currentDirectory ? state.currentDirectory.id : null));
        }, error => {
            util.i18nNotify('snippets.file_not_moved');
        });
    }

    const handleMoveFile = (directoryId, fileId) => {
        api.media.moveFile(directoryId, fileId).then(response => {
            util.i18nNotify('snippets.file_moved');
            load((state.currentDirectory ? state.currentDirectory.id : null));
        }, error => {
            util.i18nNotify('snippets.file_not_moved');
        });
    }

    const promptCreateDirectory = () => {
        util.prompt({
            title: i18n.get('snippets.new_directory'),
            confirmButtonText: i18n.get('snippets.confirm'),
            cancelButtonText: i18n.get('snippets.cancel'),
            confirm: value => {
                api.media.createDirectory(value, (state.currentDirectory ? state.currentDirectory.id : null)).then(() => {
                    util.i18nNotify('snippets.directory_created');
                    load((state.currentDirectory ? state.currentDirectory.id : null));
                });
            }
        });
    }

    const onSelectedFileContextClick = (path, file) => {
        if (path === 'jump_to') {
            load((file.directory ? file.directory.id : null));
        } else if (path === 'deselect') {
            deselect(file.id);
        }
    }

    const renderSidebar = () => {

        let links = [
            [i18n.get('snippets.deselect'), 'deselect'],
            [i18n.get('snippets.jump_to_folder'), 'jump_to']
        ];

        if (state.selectedFiles.length) {
            return (
                <div className={'file-picker-widget__selection'}>
                    <div className="file-picker-widget__selection-header">
                        {i18n.get('snippets.your_selection')} ({state.selectedFiles.length})
                    </div>
                    {state.selectedFiles.map((file, i) => {
                        return (
                            <div className="file-picker-widget__file" key={i}>
                                <ContextMenu
                                    links={links}
                                    onClick={path => onSelectedFileContextClick(path, file)}
                                >
                                    <File file={file} viewMode={'minimal'} actions={[
                                        <IconButton
                                            key={'delete'}
                                            name={'delete'}
                                            style={'transparent'}
                                            onClick={e => deselect(file.id)}
                                        />
                                    ]} />
                                </ContextMenu>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <Placeholder icon={'checklist'}>
                {i18n.get('snippets.your_selection_is_empty')}
            </Placeholder>
        );
    }

    const renderContent = () => {
        if (state.isLoading) {
            return null;
        }

        return (
            <StickySidebar sidebar={renderSidebar()}>
                <FileDropZone
                    directory={state.currentDirectory ? state.currentDirectory.id : null}
                    onCreateDirectory={handleCreateDirectory}
                    onUploadDone={handleUploadDone}
                >
                    <FileBrowser
                        fileLabels={props.fileLabels}
                        currentDirectory={state.currentDirectory}
                        selectionMode={props.selectionMode}
                        selectedFiles={state.selectedFiles}
                        selectedFileIds={state.selectedFileIds}
                        directories={state.directories}
                        files={state.files}
                        onDirectoryRename={handleRenameDirectory}
                        onFileRename={handleRenameFile}
                        onFileMove={handleMoveFile}
                        onDirectoryClick={directory => openDirectory(directory)}
                        onSelectionChange={onSelectionChange}
                        onSelectionMove={handleMoveSelection}
                    />
                </FileDropZone>
            </StickySidebar>
        );
    }

    const render = () => {
        return (
            <Window style={['modal', 'wide']} closeable={true} onClose={onCancel} title={[
                <Dropdown key={'path'} style={['primary', 'small']} openIcon={'folder'} closeIcon={'folder'}>
                    <DirectoryTree
                        selectedDirectory={state.currentDirectory ? state.currentDirectory.id : null}
                        onDirectoryClick={directory => openDirectory(directory)}
                    />
                </Dropdown>,
                <Breadcrumbs
                    key={'breadcrumbs'}
                    items={state.directoryPath}
                    onClick={item => {
                        (item ? openDirectory(item.id) : openDirectory());
                    }}
                />
            ]} actions={[
                <MediaViewSwitcher key={'view-switcher'} />,
                <Button key={'new-dir'} text={i18n.get('snippets.new_directory')} style={['secondary', 'small']} onClick={promptCreateDirectory} />,
                <Dropdown key={'upload'} text={i18n.get('snippets.upload')} style={['primary', 'small']}>
                    <FileUploader
                        directory={state.currentDirectory ? state.currentDirectory.id : null}
                        onFileUploaded={handleFileUploaded}
                        onUploadDone={handleUploadDone}
                    />
                </Dropdown>
            ]} footer={[
                <Button key={'cancel'} text={i18n.get('snippets.cancel')} style={['secondary']} onClick={onCancel} />,
                <Button
                    key={'confirm'}
                    text={(props.selectionMode ? i18n.get('snippets.confirm_selection') : i18n.get('snippets.select_file'))}
                    style={state.selectedFileIds.length ? [] : ['disabled',]}
                    onClick={state.selectedFileIds.length ? onSelectionConfirm : null}
                />
            ]}>
                {renderContent()}
            </Window>
        );
    }

    return render();
}

FilePickerWidget.defaultProps = {
    multiple: false,
    onSelectionChange: (ids, files) => {},
    onSelectionConfirm: (ids, files) => {},
    onCancel: () => {},
    defaultDirectoryId: null,
    defaultSelectedFileIds: [],
    defaultSelectedFiles: [],
    selectionMode: false,
    fileLabels: {}
};

export default FilePickerWidget;
