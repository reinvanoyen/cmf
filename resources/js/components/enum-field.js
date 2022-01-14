import React from 'react';
import Field from "../core/ui/field";
import Select from "../core/ui/select";

export default class EnumField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        options: {},
        disabled: false,
        showRequiredIndicator: false,
        tooltip: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.data[this.props.name] || Object.keys(this.props.options)[0]
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                value: this.props.data[this.props.name] || Object.keys(this.props.options)[0]
            });
        }
    }

    getData(data) {
        data[this.props.name] = this.state.value;
        return data;
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;
    }

    handleChange(value) {
        this.setState({value});
    }

    render() {
        return (
            <Field
                name={this.props.name}
                required={false}
                label={this.props.label}
                tooltip={this.props.tooltip}
            >
                <Select
                    value={this.state.value}
                    options={this.props.options}
                    onChange={value => this.handleChange(value)}
                />
            </Field>
        );
    }
}
