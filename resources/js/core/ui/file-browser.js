import React from 'react';
import ContextMenu from "./context-menu";
import Placeholder from "./placeholder";
import util from "./util";
import fileUtil from '../../util/file';
import icons from "../../svg/icons";
import FilePreview from "./file-preview";
import File from "./file";

class FileBrowser extends React.Component {

    static defaultProps = {
        files: [],
        directories: [],
        selectionMode: false,
        selectedFileIds: [],
        selectedFiles: [],
        onDirectoryClick: id => {},
        onFileClick: id => {},
        onDirectoryDelete: id => {},
        onDirectoryRename: (name, id) => {},
        onFileDelete: id => {},
        onFileRename: id => {},
        onFileOpen: file => {},
        onSelectionChange: (ids, files) => {},
        onSelectionDelete: (ids, files) => {}
    };

    onDirectoryContextClick(action, directory) {

        if (action === 'delete') {

            util.confirm({
                title: 'Delete directory?',
                text: 'Deleting this directory will also permanently delete all of its contents from your library.',
                confirmButtonText: 'Yes, delete directory',
                cancelButtonText: 'No, keep directory',
                confirm: () => this.props.onDirectoryDelete(directory.id)
            });

        } else if (action === 'rename') {

            util.prompt({
                title: 'New name',
                defaultValue: directory.name,
                confirm: value => this.props.onDirectoryRename(value, directory.id)
            });
        }
    }

    onFileContextClick(action, file) {

        if (action === 'delete') {

            util.confirm({
                title: 'Delete file?',
                text: 'Deleting this file will permanently delete it from your library.',
                confirmButtonText: 'Yes, delete file',
                cancelButtonText: 'No, keep file',
                confirm: () => this.props.onFileDelete(file.id)
            });

        } else if (action === 'rename') {

            util.prompt({
                title: 'New name',
                defaultValue: file.name,
                confirm: value => this.props.onFileRename(value, file.id)
            });

        } else if (action === 'download') {

            this.props.onFileOpen(file);

        } else if (action === 'multi-delete') {

            this.props.onSelectionDelete(this.props.selectedFileIds, this.props.selectedFiles);
        }
    }

    handleFileClick(e, file) {
        if (e.shiftKey || this.props.selectionMode) {
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

        let selectedFileIds = this.props.selectedFileIds.filter(fileId => fileId !== file.id);
        let selectedFiles = this.props.selectedFiles.filter(currFile => currFile.id !== file.id);

        /*
        this.setState({
            selectedFileIds: selectedFileIds,
            selectedFiles: selectedFiles
        });
        */

        this.props.onSelectionChange(selectedFileIds, selectedFiles);
    }

    selectFile(file) {

        let selectedFileIds = this.props.selectedFileIds;
        selectedFileIds.push(file.id);

        let selectedFiles = this.props.selectedFiles;
        selectedFiles.push(file);

        /*
        this.setState({
            selectedFileIds: selectedFileIds,
            selectedFiles: selectedFiles
        });
        */

        this.props.onSelectionChange(selectedFileIds, selectedFiles);
    }

    deselectAllExcept(file) {

        let selectedFileIds = [file.id];
        let selectedFiles = [file];

        /*
        this.setState({
            selectedFileIds: selectedFileIds,
            selectedFiles: selectedFiles
        });
        */

        this.props.onSelectionChange(selectedFileIds, selectedFiles);
    }

    isFileSelected(file) {
        return this.props.selectedFileIds.includes(file.id);
    }

    renderFiles() {

        if (! this.props.files.length) {
            return null;
        }

        let links = [
            ['Download', 'download'],
            ['Rename', 'rename'],
            ['Delete', 'delete']
        ];

        if (this.props.selectedFileIds.length > 1) {
            links = [
                ['Delete '+this.props.selectedFileIds.length+' files', 'multi-delete']
            ];
        }

        return (
            <div className={'file-list'}>
                {this.props.files.map((file, i) => {
                    return (
                        <div className="file-list__item" key={i}>
                            <ContextMenu
                                key={i}
                                links={links}
                                onClick={path => this.onFileContextClick(path, file)}
                            >
                                <File file={file} isSelected={this.isFileSelected(file)} onClick={(e, file) => this.handleFileClick(e, file)} />
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
            <div className={'directory-list'}>
                {this.props.directories.map((directory, i) => {
                    return (
                        <div className="directory-list__item" key={i}>
                            <ContextMenu
                                key={i}
                                links={[
                                    ['Rename', 'rename'],
                                    ['Delete', 'delete']
                                ]}
                                onClick={path => this.onDirectoryContextClick(path, directory)}
                            >
                                <div className="directory" onClick={e => this.props.onDirectoryClick(directory.id)}>
                                    <div className="directory__icon">
                                        {icons.folder}
                                    </div>
                                    <div className="directory__name">
                                        {directory.name}
                                    </div>
                                </div>
                            </ContextMenu>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderContent() {
        if (this.props.directories.length || this.props.files.length) {
            return (
                <div className="file-browser__content">
                    {this.renderDirectories()}
                    {this.renderFiles()}
                </div>
            );
        }

        return (
            <div className="file-browser__content">
                <Placeholder>
                    This directory is empty
                </Placeholder>
            </div>
        );
    }

    render() {
        return (
            <div className="file-browser">
                {this.renderContent()}
            </div>
        );
    }
}

export default FileBrowser;
