import React from 'react';
import FilePickerWidget from "../core/ui/file-picker-widget";
import Field from "../core/ui/field";
import FileThumb from "../core/ui/file-thumb";

class FileSelectField extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        label: '',
        name: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            selectedFile: this.props.data[this.props.name] || null,
            selectedFileId: (this.props.data[this.props.name] ? this.props.data[this.props.name].id : null)
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                selectedFile: this.props.data[this.props.name],
                selectedFileId: (this.props.data[this.props.name] ? this.props.data[this.props.name].id : null),
            });
        }
    }

    getData(data) {
        data[this.props.name] = this.state.selectedFile || null;
        return data;
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.selectedFileId || null;
    }

    open() {
        this.setState({
            isOpen: true
        });
    }

    close() {
        this.setState({
            isOpen: false
        });
    }

    onSelectionConfirm(ids, files) {
        this.setState({
            isOpen: false,
            selectedFile: files[0],
            selectedFileId: ids[0]
        });
    }

    renderFilePreview() {
        if (this.state.selectedFile) {
            return <FileThumb file={this.state.selectedFile} />;
        }

        return 'Select a file';
    }

    render() {

        let widget;

        if (this.state.isOpen) {
            widget = (
                <div className="overlay">
                    <FilePickerWidget
                        defaultSelectedFiles={this.state.selectedFile ? [this.state.selectedFile] : null}
                        defaultSelectedFileIds={this.state.selectedFile ? [this.state.selectedFile.id] : null}
                        defaultDirectoryId={this.state.selectedFile && this.state.selectedFile.directory ? this.state.selectedFile.directory.id : null}
                        onCancel={this.close.bind(this)}
                        onSelectionConfirm={this.onSelectionConfirm.bind(this)}
                    />
                </div>
            );
        }

        return (
            <React.Fragment>
                <Field name={this.props.name} label={this.props.label} errors={this.props.errors}>
                    <div className={'file-select-field'} onClick={this.open.bind(this)}>
                        {this.renderFilePreview()}
                    </div>
                </Field>
                {widget}
            </React.Fragment>
        );
    }
}

export default FileSelectField;
