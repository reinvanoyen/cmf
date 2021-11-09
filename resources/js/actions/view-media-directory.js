import React from 'react';
import api from "../api/api";
import path from "../state/path";
import util from "../core/ui/util";
import Button from "../core/ui/button";
import FileBrowser from "../core/ui/file-browser";
import FileDropZone from "../core/ui/file-drop-zone";
import FileView from "../core/ui/file-view";
import Dropdown from "../core/ui/dropdown";
import MultiFileView from "../core/ui/multi-file-view";
import Breadcrumbs from "../core/ui/breadcrumbs";

class ViewMediaDirectory extends React.Component {

    static defaultProps = {
        type: '',
        path: {},
        id: 0,
        data: {}
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
            directoryPath: []
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.path.params.directory && this.props.path.params.directory !== prevProps.path.params.directory) {
            this.load({
                directory: this.props.path.params.directory
            });
        } else if (this.props.path.params.directory !== prevProps.path.params.directory) {
            this.load();
        }
    }

    componentDidMount() {
        if (this.props.path.params.directory) {
            this.load({
                directory: this.props.path.params.directory
            });
            return;
        }
        this.load();
    }

    load(params = {}) {

        // Get the path to the current directory
        api.execute.get(this.props.path, this.props.id, 'path', params).then(response => {

            let path = response;

            this.setState({
                directoryPath: path,
                currentDirectory: path[path.length - 1]
            });
        });

        // Execute the get request
        api.execute.get(this.props.path, this.props.id,'loadDirectories', params).then(response => {

            let directories = response.data;

            // Execute the get request
            api.execute.get(this.props.path, this.props.id,'loadFiles', params).then(response => {

                let files = response.data;

                this.setState({
                    isLoading: false,
                    directories: directories,
                    files: files
                });
            });
        });
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
            util.notify('Directory deleted');
            path.refresh();
        })
    }

    handleRenameDirectory(name, directoryId) {
        if (name) {
            api.media.renameDirectory(name, directoryId).then(response => {
                util.notify('Directory renamed');
                path.refresh();
            });
        }
    }

    handleRenameFile(name, fileId) {
        if (name) {
            api.media.renameFile(name, fileId).then(response => {
                util.notify('File renamed');
                path.refresh();
            });
        }
    }

    handleDeleteFile(fileId) {
        api.media.deleteFile(fileId).then(response => {
            util.notify('File deleted');
            path.refresh();
        });
    }

    handleDeleteFiles(fileIds) {
        api.media.deleteFiles(fileIds).then(response => {
            util.notify(fileIds.length+' files were deleted');
            path.refresh();
        });
    }

    handleOpenFile(file) {
        window.open(file.url);
    }

    handleCreateFile(file) {
        if (
            (! this.props.path.params.directory && ! file.directory) ||
            (
                (file.directory && this.props.path.params.directory) &&
                (file.directory.id === this.props.path.params.directory)
            )
        ) {
            path.refresh();
        }
    }

    handleCreateDirectory(directory) {
        if (
            (! this.props.path.params.directory && ! directory.directory) ||
            (
                (directory.directory && this.props.path.params.directory) &&
                (directory.directory.id === this.props.path.params.directory)
            )
        ) {
            path.refresh();
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
                    path.refresh();
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
                <FileView file={this.state.currentFile} onDeleteFile={() => {
                    util.confirm({
                        title: 'Delete file?',
                        text: 'Deleting this file will permanently delete it from your library.',
                        confirmButtonText: 'Yes, delete file',
                        cancelButtonText: 'No, keep file',
                        confirm: () => this.handleDeleteFile(this.state.currentFile.id)
                    });
                }} onRenameFile={() => {
                    util.prompt({
                        title: 'Rename file',
                        defaultValue: this.state.currentFile.name,
                        confirmButtonText: 'Rename',
                        cancelButtonText: 'Cancel',
                        confirm: value => {
                            api.media.renameFile(value, this.state.currentFile.id).then(() => {
                                util.notify('File renamed');
                                path.refresh();
                            });
                        }
                    });
                }} />
            );
        } else if (this.state.selectedFiles.length) {
            return (
                <MultiFileView files={this.state.selectedFiles} onDeleteFiles={() => this.confirmDeleteFiles(this.state.selectedFileIds, this.state.selectedFiles)} />
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
                        onCreateFile={this.handleCreateFile.bind(this)}
                        onCreateDirectory={this.handleCreateDirectory.bind(this)}
                    >
                        <FileBrowser
                            directories={this.state.directories}
                            files={this.state.files}
                            selectedFiles={this.state.selectedFiles}
                            selectedFileIds={this.state.selectedFileIds}
                            onDirectoryClick={this.openDirectory.bind(this)}
                            onDirectoryDelete={this.handleDeleteDirectory.bind(this)}
                            onDirectoryRename={this.handleRenameDirectory.bind(this)}
                            onFileDelete={this.handleDeleteFile.bind(this)}
                            onFileRename={this.handleRenameFile.bind(this)}
                            onFileOpen={this.handleOpenFile.bind(this)}
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
            <div className={'view-media-directory'+(this.state.isDragOver ? ' view-media-directory--drag-over' : '')}>
                <div className="view-media-directory__header">
                    <div className="view-media-directory__header-title">
                        {this.renderBreadcrumbs()}
                    </div>
                    <div className="view-media-directory__header-options">
                        <Button style={['secondary', 'small']} onClick={this.promptCreateDirectory.bind(this)} text={'New directory'} />
                        <Dropdown text={'Upload'} style={['primary', 'small']}>
                            Soon a upload widget will be visible here.
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
