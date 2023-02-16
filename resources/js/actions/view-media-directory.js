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
import DirectoryTree from "../core/ui/directory-tree";
import i18n from "../util/i18n";
import str from "../util/str";
import DirectoryView from "../core/ui/directory-view";
import RootDirectoryView from "../core/ui/root-directory-view";
import MediaViewSwitcher from "../core/ui/media-view-switcher";

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
            directoryPath: []
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
                files: files,

                // We also clear the selected file(s)
                currentFile: null,
                selectedFiles: [],
                selectedFileIds: []
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
                util.i18nNotify('snippets.directory_deleted');
                this.refresh();
            });
        }, error => {
            util.i18nNotify('snippets.directory_not_deleted');
        })
    }

    handleRenameDirectory(name, directoryId) {
        if (name) {
            api.media.renameDirectory(name, directoryId).then(response => {
                util.i18nNotify('snippets.directory_renamed');
                this.refresh();
            }, error => {
                util.i18nNotify('snippets.changes_successful');
            });
        }
    }

    handleRenameFile(name, fileId) {
        if (name) {
            api.media.renameFile(name, fileId).then(response => {
                util.i18nNotify('snippets.file_renamed');
                this.refresh();
            }, error => {
                util.i18nNotify('snippets.changes_successful');
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
                util.i18nNotify('snippets.file_deleted');
                this.refresh();
            });
        }, error => {
            util.notify(i18n.get('snippets.file_not_deleted'));
        });
    }

    handleDeleteFiles(fileIds) {
        api.media.deleteFiles(fileIds).then(response => {
            this.setState({
                currentFile: null,
                selectedFiles: [],
                selectedFileIds: [],
            }, () => {
                util.i18nNotify('snippets.amount_files_deleted', {amount: fileIds.length});
                this.refresh();
            });
        }, error => {
            util.i18nNotify('snippets.files_not_deleted');
        });
    }

    handleLabelFile(label, fileId) {
        api.media.labelFile(label, fileId).then(response => {
            this.setState({
                currentFile: response.data.data
            }, () => {
                util.i18nNotify('snippets.changes_successful');
                this.refresh();
            });
        }, error => {
            util.i18nNotify('snippets.changes_successful');
        });
    }

    handleChangeFileProperty(property, value, fileId) {

        let propertiesMap = ['visibility', 'description', 'copyright'];

        if (propertiesMap.includes(property)) {
            let apiCall = api.media['updateFile'+str.toUpperCaseFirst(property)];

            apiCall(value, fileId).then(response => {
                this.setState({
                    currentFile: response.data.data
                }, () => {
                    util.notify(i18n.get('snippets.changes_successful'));
                    this.refresh();
                });
            }, error => {
                util.notify(i18n.get('snippets.changes_unsuccessful'));
            });
        }
    }

    handleChangeFilesProperty(property, value, fileIds) {

        let propertiesMap = ['description', 'copyright'];

        if (propertiesMap.includes(property)) {

            let apiCall = api.media['updateFiles'+str.toUpperCaseFirst(property)];

            apiCall(value, fileIds).then(response => {
                util.notify(i18n.get('snippets.changes_successful'));
                this.refresh();
            }, error => {
                util.notify(i18n.get('snippets.changes_unsuccessful'));
            });
        }
    }

    handleMoveDirectory(moveToId, directoryId) {
        api.media.moveDirectory(moveToId, directoryId).then(response => {
            util.notify(i18n.get('snippets.directory_moved'));
            this.refresh();
        }, error => {
            util.notify(i18n.get('snippets.changes_unsuccessful'));
        });
    }

    handleMoveFile(directoryId, fileId) {
        api.media.moveFile(directoryId, fileId).then(response => {
            util.notify(i18n.get('snippets.file_moved'));
            this.refresh();
        }, error => {
            util.notify(i18n.get('snippets.changes_unsuccessful'));
        });
    }

    handleMoveFiles(directoryId, fileIds) {
        api.media.moveFiles(directoryId, fileIds).then(response => {
            util.notify(i18n.get('snippets.files_moved'));
            this.refresh();
        }, error => {
            util.notify(i18n.get('snippets.changes_unsuccessful'));
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
            title: i18n.get('snippets.new_directory_title'),
            confirmButtonText: i18n.get('snippets.create'),
            cancelButtonText: i18n.get('snippets.cancel'),
            confirm: value => {
                api.media.createDirectory(value, this.props.path.params.directory).then(() => {
                    util.notify(i18n.get('snippets.directory_created'));
                    this.refresh();
                });
            }
        });
    }

    confirmDeleteFiles(ids, files) {
        util.confirm({
            title: i18n.get('snippets.delete_files_title', {amount: ids.length}),
            text: i18n.get('snippets.delete_files_text'),
            confirmButtonText: i18n.get('snippets.delete_files_confirm', {amount: ids.length}),
            cancelButtonText: i18n.get('snippets.delete_files_cancel'),
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
                <FileView
                    file={this.state.currentFile}
                    fileLabels={this.props.fileLabels}
                    onLabelFile={label => this.handleLabelFile(label, this.state.currentFile.id)}
                    onChangeFileProperty={(property, value) => this.handleChangeFileProperty(property, value, this.state.currentFile.id)}
                    onDeleteFile={() => {
                        util.confirm({
                            title: i18n.get('snippets.delete_file_title'),
                            text: i18n.get('snippets.delete_file_text'),
                            confirmButtonText: i18n.get('snippets.delete_file_confirm'),
                            cancelButtonText: i18n.get('snippets.delete_file_cancel'),
                            confirm: () => this.handleDeleteFile(this.state.currentFile.id)
                        });
                    }}
                    onRenameFile={() => {
                        util.prompt({
                            title: i18n.get('snippets.rename_file_title'),
                            defaultValue: this.state.currentFile.name,
                            confirmButtonText: i18n.get('snippets.rename_file_confirm'),
                            cancelButtonText: i18n.get('snippets.rename_file_cancel'),
                            confirm: value => {
                                api.media.renameFile(value, this.state.currentFile.id).then(response => {
                                    this.setState({
                                        currentFile: response.data.data
                                    }, () => {
                                        util.notify(i18n.get('snippets.file_renamed'));
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
        } else if (this.state.currentDirectory) {
            return <DirectoryView directory={this.state.currentDirectory} />;
        }

        return <RootDirectoryView />;
    }

    renderContent() {
        return (
            <>
                <div className={'view-media-directory__main'}>
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
                            onDirectoryMove={this.handleMoveDirectory.bind(this)}

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
            </>
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
                        <MediaViewSwitcher />
                        <Button
                            style={['secondary', 'small']}
                            onClick={this.promptCreateDirectory.bind(this)}
                            text={i18n.get('snippets.new_directory')}
                        />
                        <Dropdown
                            text={i18n.get('snippets.upload')}
                            style={['primary', 'small']}
                            autoClose={true}
                        >
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
