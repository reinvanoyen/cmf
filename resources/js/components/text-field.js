import React from 'react';
import dom from "../util/dom";
import Field from "../core/ui/field";
import helpers from "../util/helpers";

export default class TextField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        disabled: false,
        showRequiredIndicator: false,
        htmlType: 'text',
        multiline: false,
        errors: {},
        style: '',
        tooltip: '',
        placeholder: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.data[this.props.name] || ''
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                value: this.props.data[this.props.name]
            });
        }
    }

    getData(data) {
        data[this.props.name] = this.state.value || '';
        return data;
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value || '';
    }

    render() {

        let input;

        if (this.props.multiline) {

            input = (
                <textarea
                    id={dom.inputId(this.props.name)}
                    className={helpers.className('text-field', this.props.style)}
                    value={this.state.value || ''}
                    placeholder={this.props.placeholder}
                    onChange={this.handleChange.bind(this)}
                    onKeyUp={this.handleChange.bind(this)}
                />
            );
        } else {
            input = (
                <input
                    id={dom.inputId(this.props.name)}
                    name={this.props.name}
                    className={helpers.className('text-field', this.props.style)}
                    type={this.props.htmlType}
                    value={this.state.value || ''}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled}
                    onChange={this.handleChange.bind(this)}
                    onKeyUp={this.handleChange.bind(this)}
                    autoComplete={'off'}
                />
            );
        }

        return (
            <Field
                name={this.props.name}
                required={this.props.showRequiredIndicator}
                label={this.props.label}
                errors={this.props.errors}
                tooltip={this.props.tooltip}
            >
                {input}
            </Field>
        );
    }
}
