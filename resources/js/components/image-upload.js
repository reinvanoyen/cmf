import React from 'react';
import dom from "../util/dom";
import Field from "../core/ui/field";
import Placeholder from "../core/ui/placeholder";
import Link from "../core/ui/link";

export default class ImageUpload extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        isRequired: false
    };

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            fileAction: ''
        };

        this.inputRef = React.createRef();
        this.files = [];
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                value: this.props.data[this.props.name],
                fileAction: 'keep'
            });
        }
    }

    handleSubmit(data) {
        if (this.state.fileAction === 'keep') {

            // @TODO this isn't the right way to bypass the validation
            // A better way to bypass validation is on the backend
            // --> make a distinction for create and edit and handle validation differently for certain components,
            // like this image upload

            data[this.props.name] = 'keep';
        } else if (this.files.length) {
            data[this.props.name] = this.files[0];
        }
        data[this.props.name+'_action'] = this.state.fileAction;
    }

    onChange(event) {

        this.files = event.target.files;

        let file = this.files[0];

        if (file.type.match(/image.*/)) {

            let reader = new FileReader();

            reader.onload = e => {
                this.setState({
                    value: reader.result,
                    fileAction: 'create'
                });
            };

            reader.readAsDataURL(file);
        }
    }

    deselect() {
        this.inputRef.current.value = '';

        this.setState({
            value: '',
            fileAction: 'delete'
        });
    }

    render() {

        let input = (
            <input
                ref={this.inputRef}
                type={'file'}
                id={dom.inputId(this.props.name)}
                name={this.props.name}
                className={'image-upload__input'}
                onChange={this.onChange.bind(this)}
            />
        );

        if (this.state.value) {

            let options;

            if (! this.props.isRequired) {
                options = (
                    <div className={'image-upload__options'}>
                        <Link text={'Remove'} onClick={this.deselect.bind(this)} />
                    </div>
                );
            }

            // If there's already an image uploaded
            return (
                <Field name={this.props.name} label={this.props.label}>
                    <div className="image-upload">
                        <div className="image-upload__thumbnail">
                            <img src={this.state.value} />
                            {input}
                        </div>
                        {options}
                    </div>
                </Field>
            );
        }

        return (
            <Field name={this.props.name} label={this.props.label}>
                <div className="image-upload">
                    <div className="image-upload__placeholder">
                        <Placeholder icon="upload_file">
                            Select a {this.props.name}
                        </Placeholder>
                        {input}
                    </div>
                </div>
            </Field>
        );
    }
}
