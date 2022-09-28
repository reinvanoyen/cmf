import React from 'react';
import dom from "../util/dom";
import Field from "../core/ui/field";

export default class DateTimeField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        tooltip: '',
        errors: {},
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

        return (
            <Field
                name={this.props.name}
                required={this.props.showRequiredIndicator}
                label={this.props.label}
                errors={this.props.errors}
                tooltip={this.props.tooltip}
            >
                <input
                    id={dom.inputId(this.props.name)}
                    name={this.props.name}
                    className={'date-time-field'}
                    type={'datetime-local'}
                    value={this.state.value}
                    disabled={this.props.disabled}
                    onChange={this.handleChange.bind(this)}
                    onKeyUp={this.handleChange.bind(this)}
                />
            </Field>
        );
    }
}
