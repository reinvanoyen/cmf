import React from 'react';
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

class FilePickerWidget extends React.Component {

    static defaultProps = {
        multiple: false,
        onSelectionChange: (ids, files) => {},
        onSelectionConfirm: (ids, files) => {},
        onCancel: () => {},
        defaultDirectoryId: null,
        defaultSelectedFileIds: [],
        defaultSelectedFiles: [],
        selectionMode: false
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            directories: [],
            files: [],
            directoryPath: [],
            currentDirectory: null,
            selectedFileIds: this.props.defaultSelectedFileIds || [],
            selectedFiles: this.props.defaultSelectedFiles || []
        };
    }

    componentDidMount() {
        if (this.props.defaultDirectoryId) {
            this.load(this.props.defaultDirectoryId);
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

    onSelectionChange(ids, files) {
        this.setState({
            selectedFileIds: ids,
            selectedFiles: files
        });
        this.props.onSelectionChange(ids, files);
    }

    onSelectionConfirm() {
        this.props.onSelectionConfirm(this.state.selectedFileIds, this.state.selectedFiles);
    }

    deselect(id) {

        let fileIds = this.state.selectedFileIds.filter(fileId => fileId !== id);
        let files = this.state.selectedFiles.filter(currFile => currFile.id !== id);

        this.setState({
            selectedFileIds: fileIds,
            selectedFiles: files
        }, () => {
            this.props.onSelectionChange(this.state.selectedFileIds, this.state.selectedFiles);
        });
    }

    select(file) {
        this.setState({
            selectedFileIds: [...this.state.selectedFileIds, file.id],
            selectedFiles: [...this.state.selectedFiles, file]
        }, () => {
            this.props.onSelectionChange(this.state.selectedFileIds, this.state.selectedFiles);
        });
    }

    onCancel() {
        this.props.onCancel();
    }

    openDirectory(directoryId) {
        this.load(directoryId);
    }

    handleUploadDone() {
        util.notify('Your file(s) have been uploaded');
        this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
    }

    handleFileUploaded(file) {
        this.select(file);
    }

    handleRenameFile(name, fileId) {
        if (name) {
            api.media.renameFile(name, fileId).then(response => {
                util.notify('File renamed');
                this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
            }, error => {
                util.notify('File could not be renamed');
            });
        }
    }

    handleRenameDirectory(name, directoryId) {
        if (name) {
            api.media.renameDirectory(name, directoryId).then(response => {
                util.notify('Directory renamed');
                this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
            }, error => {
                util.notify('Directory could not be renamed');
            });
        }
    }

    promptCreateDirectory() {
        util.prompt({
            title: 'New directory',
            confirmButtonText: 'Create',
            cancelButtonText: 'Cancel',
            confirm: value => {
                api.media.createDirectory(value, (this.state.currentDirectory ? this.state.currentDirectory.id : null)).then(() => {
                    util.notify('Directory created');
                    this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
                });
            }
        });
    }

    onSelectedFileContextClick(path, file) {
        if (path === 'jump_to') {
            this.load((file.directory ? file.directory.id : null));
        } else if (path === 'deselect') {
            this.deselect(file.id);
        }
    }

    renderSidebar() {

        let links = [
            ['Deselect', 'deselect'],
            ['Jump to folder', 'jump_to']
        ];

        if (this.state.selectedFiles.length) {
            return (
                <div className={'file-picker-widget__selection'}>
                    <div className="file-picker-widget__selection-header">
                        Your selection ({this.state.selectedFiles.length})
                    </div>
                    {this.state.selectedFiles.map((file, i) => {
                        return (
                            <div className="file-picker-widget__file" key={i}>
                                <ContextMenu
                                    links={links}
                                    onClick={path => this.onSelectedFileContextClick(path, file)}
                                >
                                    <File file={file} actions={[
                                        <IconButton
                                            key={'delete'}
                                            name={'delete'}
                                            style={'transparent'}
                                            onClick={e => this.deselect(file.id)}
                                        />
                                    ]}/>
                                </ContextMenu>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className={'file-picker-widget__selection'}>
                <div className="file-picker-widget__selection-header">
                    Your selection ({this.state.selectedFiles.length})
                </div>
                <Placeholder icon={'checklist'}>
                    Your selection is empty
                </Placeholder>
            </div>
        );
    }

    renderContent() {
        if (this.state.isLoading) {
            return null;
        }

        return (
            <React.Fragment>
                <div className="file-picker-widget__main">
                    <FileBrowser
                        currentDirectory={this.state.currentDirectory}
                        selectionMode={this.props.selectionMode}
                        selectedFiles={this.state.selectedFiles}
                        selectedFileIds={this.state.selectedFileIds}
                        directories={this.state.directories}
                        files={this.state.files}
                        onDirectoryRename={this.handleRenameDirectory.bind(this)}
                        onFileRename={this.handleRenameFile.bind(this)}
                        onDirectoryClick={directory => this.openDirectory(directory)}
                        onSelectionChange={this.onSelectionChange.bind(this)}
                    />
                </div>
                <div className="file-picker-widget__side">
                    {this.renderSidebar()}
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <div className="file-picker-widget">
                <div className="file-picker-widget__header">
                    <div className="file-picker-widget__header-title">
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
                    </div>
                    <div className="file-picker-widget__header-options">
                        <Button text={'New directory'} style={['secondary', 'small']} onClick={this.promptCreateDirectory.bind(this)} />
                        <Dropdown text={'Upload'} style={['primary', 'small']}>
                            <FileUploader
                                directory={this.state.currentDirectory ? this.state.currentDirectory.id : null}
                                onFileUploaded={this.handleFileUploaded.bind(this)}
                                onUploadDone={this.handleUploadDone.bind(this)}
                            />
                        </Dropdown>
                        <IconButton name={'close'} onClick={this.onCancel.bind(this)} />
                    </div>
                </div>
                <div className="file-picker-widget__content">
                    {this.renderContent()}
                </div>
                <div className="file-picker-widget__footer">
                    <Button
                        text={'Cancel'}
                        style={['secondary']}
                        onClick={this.onCancel.bind(this)}
                    />
                    <Button
                        text={(this.props.selectionMode ? 'Confirm selection' : 'Select file')}
                        style={this.state.selectedFileIds.length ? [] : ['disabled',]}
                        onClick={this.state.selectedFileIds.length ? this.onSelectionConfirm.bind(this) : null}
                    />
                </div>
            </div>
        );
    }
}

export default FilePickerWidget;
