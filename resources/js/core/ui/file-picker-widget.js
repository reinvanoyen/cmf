import React from 'react';
import api from "../../api/api";
import FileBrowser from "./file-browser";
import Button from "./button";
import IconButton from "./icon-button";
import File from "./file";
import Breadcrumbs from "./breadcrumbs";
import axios from "axios";

class FilePickerWidget extends React.Component {

    static defaultProps = {
        multiple: false,
        onSelectionChange: (ids, files) => {},
        onSelectionConfirm: (ids, files) => {},
        onCancel: () => {},
        defaultDirectoryId: null,
        defaultSelectedFileIds: [],
        defaultSelectedFiles: []
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

    onCancel() {
        this.props.onCancel();
    }

    openDirectory(directoryId) {
        this.load(directoryId);
    }

    renderSidebar() {
        if (this.state.selectedFiles.length) {
            return (
                <div>
                    {this.state.selectedFiles.map((file, i) => {
                        return (
                            <File file={file} key={i} />
                        );
                    })}
                </div>
            );
        }
        return null;
    }

    renderContent() {
        if (this.state.isLoading) {
            return null;
        }

        return (
            <React.Fragment>
                <div className="file-picker-widget__main">
                    <FileBrowser
                        selectedFiles={this.state.selectedFiles}
                        selectedFileIds={this.state.selectedFileIds}
                        directories={this.state.directories}
                        files={this.state.files}
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
                        text={'Select file'}
                        style={this.state.selectedFileIds.length ? [] : ['disabled',]}
                        onClick={this.state.selectedFileIds.length ? this.onSelectionConfirm.bind(this) : null}
                    />
                </div>
            </div>
        );
    }
}

export default FilePickerWidget;
