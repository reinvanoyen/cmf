import React from 'react';
import FilePickerWidget from "../core/ui/file-picker-widget";
import Field from "../core/ui/field";
import Button from "../core/ui/button";
import FileThumb from "../core/ui/file-thumb";
import IconButton from "../core/ui/icon-button";

class GalleryField extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        label: '',
        name: '',
        style: '',
        singular: '',
        plural: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            selectedFiles: this.props.data[this.props.name] || [],
            selectedFilesIds: (this.props.data[this.props.name] ? this.props.data[this.props.name].map(file => file.id) : [])
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                selectedFiles: this.props.data[this.props.name] || [],
                selectedFilesIds: (this.props.data[this.props.name] ? this.props.data[this.props.name].map(file => file.id) : [])
            });
        }
    }

    getData(data) {
        //data[this.props.name] = this.state.selectedFile || null;
        return data;
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.selectedFilesIds || [];
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
            selectedFiles: files,
            selectedFilesIds: ids
        });
    }

    remove(index) {

        this.state.selectedFiles.splice(index, 1);
        this.state.selectedFilesIds.splice(index, 1);

        this.setState({
            selectedFiles: this.state.selectedFiles,
            selectedFilesIds: this.state.selectedFilesIds
        });
    }

    render() {

        let widget;

        if (this.state.isOpen) {
            widget = (
                <div className="overlay">
                    <FilePickerWidget
                        selectionMode={true}
                        defaultSelectedFiles={this.state.selectedFiles}
                        defaultSelectedFileIds={this.state.selectedFilesIds}
                        onCancel={this.close.bind(this)}
                        onSelectionConfirm={this.onSelectionConfirm.bind(this)}
                    />
                </div>
            );
        }

        return (
            <div className="gallery-field">
                <Field name={this.props.name} label={this.props.label} errors={this.props.errors}>
                    <div className="gallery-field__btn">
                        <Button style={['small', 'secondary']} icon={'add'} text={'Select '+this.props.plural} onClick={this.open.bind(this)} />
                    </div>
                    <div className="gallery-field__grid">
                        {this.state.selectedFiles.map((file, i) => {
                            return (
                                <div className="gallery-field__item" key={i}>
                                    <FileThumb file={file} />
                                    <IconButton name={'delete'} onClick={e => this.remove(i)} />
                                </div>
                            );
                        })}
                    </div>
                </Field>
                {widget}
            </div>
        );
    }
}

export default GalleryField;
