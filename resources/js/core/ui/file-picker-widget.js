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
import DirectoryTree from "./directory-tree";
import Window from "./window";
import StickySidebar from "./sticky-sidebar";
import i18n from "../../util/i18n";

class FilePickerWidget extends React.Component {

    static defaultProps = {
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

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            directories: [],
            files: [],
            directoryPath: [],
            currentDirectory: null,
            selectedFileIds: this.props.defaultSelectedFileIds || [],
            selectedFiles: this.props.defaultSelectedFiles || [],
            fileBrowserViewMode: 'list'
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
        util.i18nNotify('snippets.files_uploaded');
        this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
    }

    handleFileUploaded(file) {
        this.select(file);
    }

    handleRenameFile(name, fileId) {
        if (name) {
            api.media.renameFile(name, fileId).then(response => {
                util.i18nNotify('snippets.file_renamed');
                this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
            }, error => {
                util.i18nNotify('snippets.changes_unsuccessful');
            });
        }
    }

    handleRenameDirectory(name, directoryId) {
        if (name) {
            api.media.renameDirectory(name, directoryId).then(response => {
                util.i18nNotify('snippets.directory_renamed');
                this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
            }, error => {
                util.i18nNotify('snippets.changes_unsuccessful');
            });
        }
    }

    handleMoveSelection(directoryId, fileIds) {
        api.media.moveFiles(directoryId, fileIds).then(response => {
            util.i18nNotify('snippets.files_moved');
            this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
        }, error => {
            util.i18nNotify('snippets.file_not_moved');
        });
    }

    handleMoveFile(directoryId, fileId) {
        api.media.moveFile(directoryId, fileId).then(response => {
            util.i18nNotify('snippets.file_moved');
            this.load((this.state.currentDirectory ? this.state.currentDirectory.id : null));
        }, error => {
            util.i18nNotify('snippets.file_not_moved');
        });
    }

    promptCreateDirectory() {
        util.prompt({
            title: i18n.get('snippets.new_directory'),
            confirmButtonText: i18n.get('snippets.confirm'),
            cancelButtonText: i18n.get('snippets.cancel'),
            confirm: value => {
                api.media.createDirectory(value, (this.state.currentDirectory ? this.state.currentDirectory.id : null)).then(() => {
                    util.i18nNotify('snippets.directory_created');
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

    changeFileBrowserViewMode(mode) {
        this.setState({
            fileBrowserViewMode: mode
        });
    }

    renderSidebar() {

        let links = [
            [i18n.get('snippets.deselect'), 'deselect'],
            [i18n.get('snippets.jump_to_folder'), 'jump_to']
        ];

        if (this.state.selectedFiles.length) {
            return (
                <div className={'file-picker-widget__selection'}>
                    <div className="file-picker-widget__selection-header">
                        {i18n.get('snippets.your_selection')} ({this.state.selectedFiles.length})
                    </div>
                    {this.state.selectedFiles.map((file, i) => {
                        return (
                            <div className="file-picker-widget__file" key={i}>
                                <ContextMenu
                                    links={links}
                                    onClick={path => this.onSelectedFileContextClick(path, file)}
                                >
                                    <File file={file} viewMode={'minimal'} actions={[
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
                <Placeholder icon={'checklist'}>
                    {i18n.get('snippets.your_selection_is_empty')}
                </Placeholder>
            </div>
        );
    }

    renderContent() {
        if (this.state.isLoading) {
            return null;
        }

        return (
            <StickySidebar sidebar={this.renderSidebar()}>
                <FileBrowser
                    viewMode={this.state.fileBrowserViewMode}
                    fileLabels={this.props.fileLabels}
                    currentDirectory={this.state.currentDirectory}
                    selectionMode={this.props.selectionMode}
                    selectedFiles={this.state.selectedFiles}
                    selectedFileIds={this.state.selectedFileIds}
                    directories={this.state.directories}
                    files={this.state.files}
                    onDirectoryRename={this.handleRenameDirectory.bind(this)}
                    onFileRename={this.handleRenameFile.bind(this)}
                    onFileMove={this.handleMoveFile.bind(this)}
                    onDirectoryClick={directory => this.openDirectory(directory)}
                    onSelectionChange={this.onSelectionChange.bind(this)}
                    onSelectionMove={this.handleMoveSelection.bind(this)}
                />
            </StickySidebar>
        );
    }

    render() {
        return (
            <Window style={['modal', 'wide']} closeable={true} onClose={this.onCancel.bind(this)} title={[
                <Dropdown key={'path'} style={['primary', 'small']} openIcon={'folder'} closeIcon={'folder'}>
                    <DirectoryTree
                        selectedDirectory={this.state.currentDirectory ? this.state.currentDirectory.id : null}
                        onDirectoryClick={directory => this.openDirectory(directory)}
                    />
                </Dropdown>,
                <Breadcrumbs
                    key={'breadcrumbs'}
                    items={this.state.directoryPath}
                    onClick={item => {
                        (item ? this.openDirectory(item.id) : this.openDirectory());
                    }}
                />
            ]} actions={[
                <IconButton key={'view-list'} name={'view_list'} onClick={e => this.changeFileBrowserViewMode('list')} />,
                <IconButton key={'view-grid'} name={'grid_view'} onClick={e => this.changeFileBrowserViewMode('grid')} />,
                <Button key={'new-dir'} text={i18n.get('snippets.new_directory')} style={['secondary', 'small']} onClick={this.promptCreateDirectory.bind(this)} />,
                <Dropdown key={'upload'} text={i18n.get('snippets.upload')} style={['primary', 'small']}>
                    <FileUploader
                        directory={this.state.currentDirectory ? this.state.currentDirectory.id : null}
                        onFileUploaded={this.handleFileUploaded.bind(this)}
                        onUploadDone={this.handleUploadDone.bind(this)}
                    />
                </Dropdown>
            ]} footer={[
                <Button key={'cancel'} text={i18n.get('snippets.cancel')} style={['secondary']} onClick={this.onCancel.bind(this)} />,
                <Button
                    key={'confirm'}
                    text={(this.props.selectionMode ? i18n.get('snippets.confirm_selection') : i18n.get('snippets.select_file'))}
                    style={this.state.selectedFileIds.length ? [] : ['disabled',]}
                    onClick={this.state.selectedFileIds.length ? this.onSelectionConfirm.bind(this) : null}
                />
            ]}>
                {this.renderContent()}
            </Window>
        );
    }
}

export default FilePickerWidget;
