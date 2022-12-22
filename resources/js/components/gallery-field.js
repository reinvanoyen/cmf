import React from 'react';
import FilePickerWidget from "../core/ui/file-picker-widget";
import Field from "../core/ui/field";
import Button from "../core/ui/button";
import IconButton from "../core/ui/icon-button";
import Placeholder from "../core/ui/placeholder";
import array from "../util/array";
import FileThumb from "../core/ui/file-thumb";
import Overlay from "../core/ui/overlay";
import i18n from "../util/i18n";

class GalleryField extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        label: '',
        name: '',
        style: '',
        singular: '',
        plural: '',
        tooltip: '',
        orderColumn: '',
        fileLabels: {}
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
        data[this.props.name] = this.state.selectedFiles || [];
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

    sortForward(i) {
        if (i !== (this.state.selectedFiles.length - 1)) {
            this.setState({
                selectedFiles: array.move(this.state.selectedFiles, i, i+1),
                selectedFilesIds: array.move(this.state.selectedFilesIds, i, i+1)
            });
        }
    }

    sortBackward(i) {
        if (i !== 0) {
            this.setState({
                selectedFiles: array.move(this.state.selectedFiles, i, i-1),
                selectedFilesIds: array.move(this.state.selectedFilesIds, i, i-1)
            });
        }
    }

    renderItemOverlay(i) {

        let orderActions;
        let orderLeft;
        let orderRight;

        if (this.props.orderColumn) {
            if (i !== 0) {
                orderLeft = <IconButton name={'arrow_back'} onClick={e => this.sortBackward(i)} />;
            }
            if (i !== (this.state.selectedFiles.length - 1)) {
                orderRight = <IconButton name={'arrow_forward'} onClick={e => this.sortForward(i)} />;
            }

            orderActions = (
                <div className="gallery-field__item-order">
                    {orderLeft}
                    {orderRight}
                </div>
            );
        }

        return (
            <div className="gallery-field__item-overlay">
                <div className="gallery-field__item-delete">
                    <IconButton name={'delete'} onClick={e => this.remove(i)} />
                </div>
                {orderActions}
            </div>
        );
    }

    renderContent() {

        if (this.state.selectedFiles.length) {
            return (
                <div className="gallery-field__grid">
                    {this.state.selectedFiles.map((file, i) => {
                        return (
                            <div className="gallery-field__item" key={i}>
                                <FileThumb
                                    file={file}
                                    fileLabels={this.props.fileLabels}
                                    mediaConversion={'contain'}
                                />
                                {this.renderItemOverlay(i)}
                            </div>
                        );
                    })}
                    <Placeholder icon={'image_search'} onClick={this.open.bind(this)}>
                        {i18n.get('snippets.add_plural', {plural: this.props.plural})}
                    </Placeholder>
                </div>
            );
        }

        return (
            <Placeholder icon={'image_search'} onClick={this.open.bind(this)}>
                {i18n.get('snippets.select_plural', {plural: this.props.plural})}
            </Placeholder>
        );
    }

    render() {

        let widget;

        if (this.state.isOpen) {
            widget = (
                <Overlay>
                    <FilePickerWidget
                        fileLabels={this.props.fileLabels}
                        selectionMode={true}
                        defaultSelectedFiles={this.state.selectedFiles}
                        defaultSelectedFileIds={this.state.selectedFilesIds}
                        onCancel={this.close.bind(this)}
                        onSelectionConfirm={this.onSelectionConfirm.bind(this)}
                    />
                </Overlay>
            );
        }

        return (
            <Field
                name={this.props.name}
                label={this.props.label}
                errors={this.props.errors}
                tooltip={this.props.tooltip}
            >
                <div className="gallery-field">
                    <div className="gallery-field__btn">
                        <Button
                            style={['small', 'secondary']}
                            icon={'add'}
                            text={i18n.get('snippets.select_plural', {plural: this.props.plural})}
                            onClick={this.open.bind(this)}
                        />
                    </div>
                    <div className="gallery-field__content">
                        {this.renderContent()}
                    </div>
                </div>
                {widget}
            </Field>
        );
    }
}

export default GalleryField;
