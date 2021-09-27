import React from 'react';
import dom from "../util/dom";
import Field from "../core/ui/field";

export default class TextField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        disabled: false,
        showRequiredIndicator: false,
        htmlType: 'text',
        multiline: false
    };

    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };
    }

    componentDidUpdate(prevProps) {

        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                value: this.props.data[this.props.name]
            });
        }
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
                    className={'text-field'}
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                    onKeyUp={this.handleChange.bind(this)}
                />
            );
        } else {
            input = (
                <input
                    id={dom.inputId(this.props.name)}
                    name={this.props.name}
                    className={'text-field'}
                    type={this.props.htmlType}
                    defaultValue={this.state.value}
                    disabled={this.props.disabled}
                    onChange={this.handleChange.bind(this)}
                    onKeyUp={this.handleChange.bind(this)}
                />
            );
        }

        return (
            <Field name={this.props.name} required={this.props.showRequiredIndicator} label={this.props.label}>
                {input}
            </Field>
        );
    }
}
