import React from 'react';
import ContextMenu from "./context-menu";
import Placeholder from "./placeholder";
import util from "./util";
import File from "./file";
import Manager from "../messaging/manager";
import FilePlaceholder from "./file-placeholder";
import MediaMoveWidget from "./media-move-widget";
import Overlay from "./overlay";
import Directory from "./directory";
import i18n from "../../util/i18n";

class FileBrowser extends React.Component {

    static defaultProps = {
        files: [],
        directories: [],
        currentDirectory: null,
        fileLabels: {},
        selectionMode: false,
        selectedFileIds: [],
        selectedFiles: [],
        viewMode: 'list',

        // Events
        onDirectoryClick: id => {},
        onFileClick: id => {},

        onDirectoryDelete: id => {},
        onDirectoryRename: (name, id) => {},
        onDirectoryMove: (directory, id) => {},

        onFileDelete: id => {},
        onFileRename: id => {},
        onFileMove: (directory, id) => {},
        onFileOpen: file => {},

        onSelectionChange: (ids, files) => {},
        onSelectionDelete: (ids, files) => {},
        onSelectionMove: (directory, ids) => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            uploads: [],
            files: this.props.files,

            // Move action state
            moveAction: false,
            moveFileId: null,
            moveFileIds: [],
            moveDirectoryId: null
        };

        this.handleOnUploadQueued = this.onUploadQueued.bind(this);
        this.handleOnUploadQueuedMultiple = this.onUploadQueuedMultiple.bind(this);
        this.handleOnUploadStart = this.onUploadStart.bind(this);
        this.handleOnUploadProgress = this.onUploadProgress.bind(this);
        this.handleOnUploadSuccess = this.onUploadSuccess.bind(this);
        this.handleOnUploadFail = this.onUploadFail.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.files !== this.props.files) {
            this.setState({
                files: this.props.files
            });
        }
    }

    componentDidMount() {
        Manager.on('media.upload.queued', this.handleOnUploadQueued);
        Manager.on('media.upload.queuedMultiple', this.handleOnUploadQueuedMultiple);
        Manager.on('media.upload.start', this.handleOnUploadStart);
        Manager.on('media.upload.progress', this.handleOnUploadProgress);
        Manager.on('media.upload.success', this.handleOnUploadSuccess);
        Manager.on('media.upload.fail', this.handleOnUploadFail);
    }

    componentWillUnmount() {
        Manager.off('media.upload.queued', this.handleOnUploadQueued);
        Manager.off('media.upload.queuedMultiple', this.handleOnUploadQueuedMultiple);
        Manager.off('media.upload.start', this.handleOnUploadStart);
        Manager.off('media.upload.progress', this.handleOnUploadProgress);
        Manager.off('media.upload.success', this.handleOnUploadSuccess);
        Manager.off('media.upload.fail', this.handleOnUploadFail);
    }

    onUploadQueued(uploadData) {
        this.setState({
            uploads: [...this.state.uploads, {
                id: uploadData.id,
                size: uploadData.size,
                name: uploadData.filename,
                progress: 0,
                status: 'queued'
            }]
        });
    }

    onUploadQueuedMultiple(uploadData) {

        let uploads = uploadData.files.map(upload => {
            return {
                id: upload.id,
                size: upload.size,
                name: upload.filename,
                progress: 0,
                status: 'queued'
            };
        });
        let newUploads = this.state.uploads.concat(uploads);

        this.setState({
            uploads: newUploads
        });
    }

    onUploadStart(uploadData) {
        // for reference
    }

    onUploadProgress(uploadData) {
        this.state.uploads.forEach(upload => {
            if (upload.id === uploadData.id) {
                upload.status = 'uploading';
                upload.progress = uploadData.progress;
            }
        });
        this.setState({
            uploads: this.state.uploads
        });
    }

    onUploadSuccess(uploadData) {

        let file = uploadData.file;
        let directoryId = (file.directory ? file.directory.id : null);
        let currentDirectoryId = (this.props.currentDirectory ? this.props.currentDirectory.id : null);

        this.setState({
            files: (directoryId === currentDirectoryId ? [file, ...this.state.files] : this.state.files),
            uploads: this.state.uploads.filter(v => v.id !== uploadData.id),
        });
    }

    onUploadFail(uploadData) {
        this.setState({
            uploads: this.state.uploads.filter(v => v.id !== uploadData.id),
        });
    }

    onDirectoryContextClick(action, directory) {

        if (action === 'delete') {

            util.confirm({
                title: i18n.get('snippets.delete_directory_title'),
                text: i18n.get('snippets.delete_directory_text'),
                confirmButtonText: i18n.get('snippets.delete_directory_confirm'),
                cancelButtonText: i18n.get('snippets.delete_directory_cancel'),
                confirm: () => this.props.onDirectoryDelete(directory.id)
            });

        } else if (action === 'rename') {

            util.prompt({
                title: i18n.get('snippets.rename'),
                defaultValue: directory.name,
                confirm: value => this.props.onDirectoryRename(value, directory.id)
            });

        } else if (action === 'move') {

            this.setState({
                moveAction: true,
                moveDirectoryId: directory.id
            });
        }
    }

    onFileContextClick(action, file) {

        if (action === 'delete') {

            util.confirm({
                title: i18n.get('snippets.delete_file_title'),
                text: i18n.get('snippets.delete_file_text'),
                confirmButtonText: i18n.get('snippets.delete_file_confirm'),
                cancelButtonText: i18n.get('snippets.delete_file_cancel'),
                confirm: () => this.props.onFileDelete(file.id)
            });

        } else if (action === 'rename') {

            util.prompt({
                title: i18n.get('snippets.rename_file'),
                defaultValue: file.name,
                confirm: value => this.props.onFileRename(value, file.id)
            });

        } else if (action === 'download') {

            this.props.onFileOpen(file);

        } else if (action === 'move') {

            this.setState({
                moveAction: true,
                moveFileId: file.id,
                moveFileIds: []
            });

        } else if (action === 'multi-delete') {

            this.props.onSelectionDelete(this.props.selectedFileIds, this.props.selectedFiles);

        } else if (action === 'multi-move') {

            this.setState({
                moveAction: true,
                moveFileId: null,
                moveFileIds: this.props.selectedFileIds
            });
        }
    }

    handleFileClick(e, file) {
        if (e.shiftKey || e.metaKey || this.props.selectionMode) {
            this.toggleFileSelection(file);
        } else {
            this.deselectAllExcept(file);
        }
        this.props.onFileClick(file.id);
    }

    toggleFileSelection(file) {
        if (this.isFileSelected(file)) {
            this.deselectFile(file);
        } else {
            this.selectFile(file);
        }
    }

    deselectFile(file) {
        this.props.onSelectionChange(
            this.props.selectedFileIds.filter(fileId => fileId !== file.id),
            this.props.selectedFiles.filter(currFile => currFile.id !== file.id)
        );
    }

    selectFile(file) {
        this.props.onSelectionChange([...this.props.selectedFileIds, file.id], [...this.props.selectedFiles, file]);
    }

    deselectAllExcept(file) {
        this.props.onSelectionChange([file.id], [file]);
    }

    isFileSelected(file) {
        return this.props.selectedFileIds.includes(file.id);
    }

    renderMoveWidget() {

        if (! this.state.moveAction) {
            return null;
        }

        return (
            <Overlay>
                <MediaMoveWidget
                    directory={this.props.currentDirectory}
                    onCancel={directory => {
                        this.setState({
                            moveAction: false,
                            moveFileId: null,
                            moveFileIds: [],
                            moveDirectoryId: null
                        });
                    }}
                    onConfirm={directory => {
                        this.setState({
                            moveAction: false
                        }, () => {
                            if (this.state.moveFileIds.length) {
                                this.props.onSelectionMove(directory, this.state.moveFileIds);
                            } else if (this.state.moveFileId) {
                                this.props.onFileMove(directory, this.state.moveFileId);
                            }

                            if (this.state.moveDirectoryId === directory) {
                                util.notify(i18n.get('snippets.cant_move_directory_inside_self'));
                                return;
                            }

                            if (this.state.moveDirectoryId) {
                                this.props.onDirectoryMove(directory, this.state.moveDirectoryId);
                            }
                        });
                    }}
                />
            </Overlay>
        );
    }

    renderUploads() {

        if (! this.state.uploads.length) {
            return null;
        }

        return (
            <div className={'file-list'}>
                {this.state.uploads.map((file, i) => {
                    return (
                        <div className="file-list__item" key={i}>
                            <FilePlaceholder data={file} />
                        </div>
                    );
                })}
            </div>
        );
    }

    renderFiles() {

        if (! this.state.files.length) {
            return null;
        }

        let links = [
            [i18n.get('snippets.rename'), 'rename'],
            [i18n.get('snippets.move'), 'move'],
            [i18n.get('snippets.download'), 'download'],
            [i18n.get('snippets.delete'), 'delete']
        ];

        if (this.props.selectedFileIds.length > 1) {
            links = [
                [i18n.get('snippets.move_files', {amount: this.props.selectedFileIds.length}), 'multi-move'],
                [i18n.get('snippets.delete_files', {amount: this.props.selectedFileIds.length}), 'multi-delete']
            ];
        }

        return (
            <div className={'file-list file-list--'+this.props.viewMode}>
                {this.state.files.map((file, i) => {
                    return (
                        <div className="file-list__item" key={i}>
                            <ContextMenu
                                key={i}
                                links={links}
                                onClick={path => this.onFileContextClick(path, file)}
                            >
                                <File
                                    viewMode={this.props.viewMode}
                                    file={file}
                                    fileLabels={this.props.fileLabels}
                                    isSelected={this.isFileSelected(file)}
                                    selectionMode={this.props.selectionMode}
                                    onClick={(e, file) => this.handleFileClick(e, file)}
                                />
                            </ContextMenu>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderDirectories() {

        if (! this.props.directories.length) {
            return null;
        }

        return (
            <div className={'directory-list directory-list--'+this.props.viewMode}>
                {this.props.directories.map((directory, i) => {
                    return (
                        <div className="directory-list__item" key={i}>
                            <ContextMenu
                                key={i}
                                links={[
                                    [i18n.get('snippets.rename'), 'rename'],
                                    [i18n.get('snippets.move'), 'move'],
                                    [i18n.get('snippets.delete'), 'delete']
                                ]}
                                onClick={path => this.onDirectoryContextClick(path, directory)}
                            >
                                <Directory
                                    viewMode={this.props.viewMode}
                                    directory={directory}
                                    onClick={(e, directory) => this.props.onDirectoryClick(directory.id)}
                                />
                            </ContextMenu>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderContent() {
        if (this.state.uploads.length || this.props.directories.length || this.state.files.length) {
            return (
                <div className="file-browser__content">
                    {this.renderUploads()}
                    {this.renderDirectories()}
                    {this.renderFiles()}
                </div>
            );
        }

        return (
            <div className="file-browser__content">
                <div className="file-browser__placeholder">
                    <Placeholder>
                        {i18n.get('snippets.directory_is_empty')}
                    </Placeholder>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="file-browser">
                {this.renderContent()}
                {this.renderMoveWidget()}
            </div>
        );
    }
}

export default FileBrowser;
