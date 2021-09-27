import React from 'react';
import Field from "../core/ui/field";
import Trix from 'trix';
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";

//import { ReactTrixRTEInput } from "react-trix-rte";

export default class RichtextField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    handleEditorReady(editor) {
        //
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            if (this.props.data[this.props.name]) {
                this.setState({
                    value: this.props.data[this.props.name]
                });
            }
        }
    }

    handleChange(html, text) {
        this.setState({
            value: html
        });
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;
    }

    render() {
        return (
            <Field name={this.props.name} label={this.props.label}>
                <div className="richtext-field">
                    <TrixEditor
                        key={this.props.data[this.props.name] ? 'yes' : 'no'}
                        value={this.props.data[this.props.name] ? this.props.data[this.props.name] : ''}
                        onChange={this.handleChange.bind(this)}
                        onEditorReady={this.handleEditorReady.bind(this)}
                    />
                </div>
            </Field>
        );
    }
}
