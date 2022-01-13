import React from 'react';
import Field from "../core/ui/field";

export default class EnumField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        options: {},
        disabled: false,
        showRequiredIndicator: false
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
                value: this.props.data[this.props.name] || ''
            });
        }
    }

    getValue() {
        if (this.state.value) {
            return this.state.value;
        }

        if (this.props.data[this.props.name]) {
            return this.props.data[this.props.name];
        }

        return Object.keys(this.props.options)[0] || '';
    }

    getData(data) {
        data[this.props.name] = this.getValue();
        return data;
    }

    handleSubmit(data) {
        data[this.props.name] = this.getValue();
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    render() {

        let options = [];
        for (let value in this.props.options) {
            if (this.props.options.hasOwnProperty(value)) {
                options.push(
                    <option value={value} key={value}>
                        {this.props.options[value]}
                    </option>
                );
            }
        }

        return (
            <Field name={this.props.name} required={false} label={this.props.label}>
                <select
                    name={this.props.name}
                    className={'enum-field'}
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                >
                    {options}
                </select>
            </Field>
        );
    }
}
