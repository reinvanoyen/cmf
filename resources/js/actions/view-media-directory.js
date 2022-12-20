import React from 'react';
import axios from 'axios';
import api from "../api/api";
import path from "../state/path";
import util from "../core/ui/util";
import Button from "../core/ui/button";
import FileBrowser from "../core/ui/file-browser";
import FileDropZone from "../core/ui/file-drop-zone";
import FileView from "../core/ui/file-view";
import Dropdown from "../core/ui/dropdown";
import MultiFileView from "../core/ui/multi-file-view";
import FileUploader from "../core/ui/file-uploader";
import Breadcrumbs from "../core/ui/breadcrumbs";
import IconButton from "../core/ui/icon-button";
import TreeItem from "../core/ui/tree-item";
import DirectoryTree from "../core/ui/directory-tree";

class ViewMediaDirectory extends React.Component {

    static defaultProps = {
        type: '',
        path: {},
        id: 0,
        data: {},
        fileLabels: {}
    };

    constructor(props) {

        super(props);

        this.state = {
            isLoading: true,
            directories: [],
            files: [],
            currentDirectory: null,
            currentFile: null,
            selectedFiles: [],
            selectedFileIds: [],
            directoryPath: [],
            fileBrowserViewMode: 'list'
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.path.params.directory && this.props.path.params.directory !== prevProps.path.params.directory) {
            this.load(this.props.path.params.directory);
        } else if (this.props.path.params.directory !== prevProps.path.params.directory) {
            this.load();
        }
    }

    componentDidMount() {
        if (this.props.path.params.directory) {
            this.load(this.props.path.params.directory);
            return;
        }
        this.load();
    }

    async load(directoryId = null) {
        await axios.all([
            api.media.path(directoryId),
            api.media.loadDirectories(directoryId),
            api.media.loadFiles(directoryId)
        ]).then(axios.spread((response1, response2, response3) => {

            let path = response1.data.data;
            let directories = response2.data.data;
            let files = response3.data.data;

            this.setState({
                isLoading: false,
                directoryPath: path,
                currentDirectory: path[path.length - 1],
                directories: directories,
                files: files
            });
        }));
    }

    refresh() {
        if (this.props.path.params.directory) {
            this.load(this.props.path.params.directory);
            return;
        }
        this.load();
    }

    openDirectory(id = null) {
        if (id) {
            path.goTo(this.props.path.module, this.props.path.action, {
                directory: id
            });
            return;
        }

        path.goTo(this.props.path.module, this.props.path.action);
    }

    handleSelectionChange(selectedFileIds, selectedFiles) {
        if (! selectedFiles.length) {
            this.setState({
                currentFile: null,
                selectedFiles: [],
                selectedFileIds: []
            });
        } else if (selectedFiles.length === 1) {
            this.setState({
                currentFile: selectedFiles[0],
                selectedFiles: selectedFiles,
                selectedFileIds: selectedFileIds
            });
        } else {
            this.setState({
                currentFile: null,
                selectedFiles: selectedFiles,
                selectedFileIds: selectedFileIds
            });
        }
    }

    handleDeleteDirectory(directoryId) {
        api.media.deleteDirectory(directoryId).then(response => {
            this.setState({
                currentFile: null,
                selectedFiles: [],
                selectedFileIds: [],
            }, () => {
                util.notify('Directory deleted');
                this.refresh();
            });
        }, error => {
            util.notify('Directory could not be deleted');
        })
    }

    handleRenameDirectory(name, directoryId) {
        if (name) {
            api.media.renameDirectory(name, directoryId).then(response => {
                util.notify('Directory renamed');
                this.refresh();
            }, error => {
                util.notify('Directory could not be renamed');
            });
        }
    }

    handleRenameFile(name, fileId) {
        if (name) {
            api.media.renameFile(name, fileId).then(response => {
                util.notify('File renamed');
                this.refresh();
            }, error => {
                util.notify('File could not be renamed');
            });
        }
    }

    handleDeleteFile(fileId) {
        api.media.deleteFile(fileId).then(response => {
            this.setState({
                currentFile: null,
                selectedFiles: [],
                selectedFileIds: [],
            }, () => {
                util.notify('File deleted');
                this.refresh();
            });
        }, error => {
            util.notify('File could not be deleted');
        });
    }

    handleDeleteFiles(fileIds) {
        api.media.deleteFiles(fileIds).then(response => {
            this.setState({
                currentFile: null,
                selectedFiles: [],
                selectedFileIds: [],
            }, () => {
                util.notify(fileIds.length+' files were deleted');
                this.refresh();
            });
        }, error => {
            util.notify('Files could not be deleted');
        });
    }

    handleLabelFile(label, fileId) {
        api.media.labelFile(label, fileId).then(response => {
            this.setState({
                currentFile: response.data.data
            }, () => {
                util.notify((label ? label+' label added to file' : 'File label removed'));
                this.refresh();
            });
        }, error => {
            util.notify('File could not be labeled');
        });
    }

    handleChangeFileProperty(property, value, fileId) {

        let propertiesMap = ['Visibility', 'Description', 'Copyright'];

        if (propertiesMap.includes(property)) {
            let apiCall = api.media['updateFile'+property];

            apiCall(value, fileId).then(response => {
                this.setState({
                    currentFile: response.data.data
                }, () => {
                    util.notify(property+' updated');
                    this.refresh();
                });
            }, error => {
                util.notify(property+' of file could not be updated');
            });
        }
    }

    handleChangeFilesProperty(property, value, fileIds) {

        let propertiesMap = ['Description', 'Copyright'];

        if (propertiesMap.includes(property)) {

            let apiCall = api.media['updateFiles'+property];

            apiCall(value, fileIds).then(response => {
                util.notify(property+' updated for all files');
                this.refresh();
            }, error => {
                util.notify(property+' of file(s) could not be updated');
            });
        }
    }

    handleMoveFile(directoryId, fileId) {
        api.media.moveFile(directoryId, fileId).then(response => {
            util.notify('File moved');
            this.refresh();
        }, error => {
            util.notify('File could not be moved');
        });
    }

    handleMoveFiles(directoryId, fileIds) {
        api.media.moveFiles(directoryId, fileIds).then(response => {
            util.notify('Files moved');
            this.refresh();
        }, error => {
            util.notify('Files could not be moved');
        });
    }

    handleOpenFile(file) {
        window.open(file.url);
    }

    handleUploadDone() {
        this.refresh();
    }

    handleCreateDirectory(directory) {
        if (
            (! this.props.path.params.directory && ! directory.directory) ||
            (
                (directory.directory && this.props.path.params.directory) &&
                (directory.directory.id === this.props.path.params.directory)
            )
        ) {
            this.refresh();
        }
    }

    promptCreateDirectory() {
        util.prompt({
            title: 'New directory',
            confirmButtonText: 'Create',
            cancelButtonText: 'Cancel',
            confirm: value => {
                api.media.createDirectory(value, this.props.path.params.directory).then(() => {
                    util.notify('Directory created');
                    this.refresh();
                });
            }
        });
    }

    confirmDeleteFiles(ids, files) {
        util.confirm({
            title: 'Delete '+ids.length+' files?',
            text: 'Deleting these files will permanently delete them from your library. This action is irreversible.',
            confirmButtonText: 'Yes, delete '+ids.length+' files',
            cancelButtonText: 'No, keep files',
            confirm: () => this.handleDeleteFiles(ids)
        });
    }

    changeFileBrowserViewMode(mode) {
        this.setState({
            fileBrowserViewMode: mode
        });
    }

    renderBreadcrumbs() {
        return (
            <Breadcrumbs
                items={this.state.directoryPath}
                onClick={item => {
                    if (item) {
                        this.openDirectory(item.id);
                        return;
                    }
                    this.openDirectory();
                }}
            />
        );
    }

    renderSidebar() {
        if (this.state.currentFile) {
            return (
                <FileView
                    file={this.state.currentFile}
                    fileLabels={this.props.fileLabels}
                    onLabelFile={label => this.handleLabelFile(label, this.state.currentFile.id)}
                    onChangeFileProperty={(property, value) => this.handleChangeFileProperty(property, value, this.state.currentFile.id)}
                    onDeleteFile={() => {
                        util.confirm({
                            title: 'Delete file?',
                            text: 'Deleting this file will permanently delete it from your library.',
                            confirmButtonText: 'Yes, delete file',
                            cancelButtonText: 'No, keep file',
                            confirm: () => this.handleDeleteFile(this.state.currentFile.id)
                        });
                    }}
                    onRenameFile={() => {
                        util.prompt({
                            title: 'Rename file',
                            defaultValue: this.state.currentFile.name,
                            confirmButtonText: 'Rename',
                            cancelButtonText: 'Cancel',
                            confirm: value => {
                                api.media.renameFile(value, this.state.currentFile.id).then(response => {
                                    this.setState({
                                        currentFile: response.data.data
                                    }, () => {
                                        util.notify('File renamed');
                                        this.refresh();
                                    });
                                });
                            }
                        });
                    }}
                    onMoveFile={this.handleMoveFile.bind(this)}
                />
            );
        } else if (this.state.selectedFiles.length) {
            return (
                <MultiFileView
                    files={this.state.selectedFiles}
                    onDeleteFiles={() => this.confirmDeleteFiles(this.state.selectedFileIds, this.state.selectedFiles)}
                    onChangeFilesProperty={(property, value) => this.handleChangeFilesProperty(property, value, this.state.selectedFileIds)}
                    onMoveFiles={this.handleMoveFiles.bind(this)}
                />
            );
        }
        return null;
    }

    renderContent() {
        return (
            <React.Fragment>
                <div className="view-media-directory__main">
                    <FileDropZone
                        directory={this.state.currentDirectory ? this.state.currentDirectory.id : null}
                        onCreateDirectory={this.handleCreateDirectory.bind(this)}
                        onUploadDone={this.handleUploadDone.bind(this)}
                    >
                        <FileBrowser
                            viewMode={this.state.fileBrowserViewMode}
                            currentDirectory={this.state.currentDirectory}
                            directories={this.state.directories}
                            files={this.state.files}
                            fileLabels={this.props.fileLabels}
                            selectedFiles={this.state.selectedFiles}
                            selectedFileIds={this.state.selectedFileIds}

                            onDirectoryClick={this.openDirectory.bind(this)}
                            onDirectoryDelete={this.handleDeleteDirectory.bind(this)}
                            onDirectoryRename={this.handleRenameDirectory.bind(this)}
                            onFileDelete={this.handleDeleteFile.bind(this)}
                            onFileRename={this.handleRenameFile.bind(this)}
                            onFileOpen={this.handleOpenFile.bind(this)}
                            onFileMove={this.handleMoveFile.bind(this)}
                            onSelectionMove={this.handleMoveFiles.bind(this)}

                            onSelectionChange={this.handleSelectionChange.bind(this)}
                            onSelectionDelete={this.confirmDeleteFiles.bind(this)}
                        />
                    </FileDropZone>
                </div>
                <div className="view-media-directory__side">
                    {this.renderSidebar()}
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className={'view-media-directory'+(this.state.isLoading ? ' view-media-directory--loading' : '')+(this.state.isDragOver ? ' view-media-directory--drag-over' : '')}>
                <div className="view-media-directory__header">
                    <div className="view-media-directory__header-title">
                        <Dropdown style={['primary', 'small']} openIcon={'folder'} closeIcon={'folder'}>
                            <DirectoryTree
                                selectedDirectory={this.state.currentDirectory ? this.state.currentDirectory.id : null}
                                onDirectoryClick={directory => this.openDirectory(directory)}
                            />
                        </Dropdown>
                        {this.renderBreadcrumbs()}
                    </div>
                    <div className="view-media-directory__header-options">
                        <IconButton name={'view_list'} onClick={e => this.changeFileBrowserViewMode('list')} />
                        <IconButton name={'grid_view'} onClick={e => this.changeFileBrowserViewMode('grid')} />
                        <Button
                            style={['secondary', 'small']}
                            onClick={this.promptCreateDirectory.bind(this)}
                            text={'New directory'}
                        />
                        <Dropdown text={'Upload'} style={['primary', 'small']} autoClose={true}>
                            <FileUploader
                                directory={this.state.currentDirectory ? this.state.currentDirectory.id : null}
                                onUploadDone={this.handleUploadDone.bind(this)}
                            />
                        </Dropdown>
                    </div>
                </div>
                <div className="view-media-directory__content">
                    {this.state.isLoading ? null : this.renderContent()}
                </div>
            </div>
        );
    }
}

export default ViewMediaDirectory;
