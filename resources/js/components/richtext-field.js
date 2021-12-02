import React from 'react';
import Field from "../core/ui/field";
import Trix from 'trix';
import { TrixEditor } from "react-trix";
import "trix/dist/trix.css";

export default class RichtextField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            redrawKey: 0,
            value: this.props.data[this.props.name] || ''
        };
    }

    handleEditorReady(editor) {
        //
    }

    componentWillUnmount() {
        //
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                redrawKey: this.state.redrawKey + 1,
                value: this.props.data[this.props.name] || ''
            });
        }
    }

    handleChange(html, text) {
        this.setState({
            value: html
        });
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value || '';
    }

    getData(data) {
        data[this.props.name] = this.state.value || '';
        return data;
    }

    render() {
        return (
            <Field name={this.props.name} label={this.props.label}>
                <div className="richtext-field">
                    <TrixEditor
                        key={this.state.redrawKey}
                        value={this.props.data[this.props.name] || ''}
                        onChange={this.handleChange.bind(this)}
                        onEditorReady={this.handleEditorReady.bind(this)}
                    />
                </div>
            </Field>
        );
    }
}
