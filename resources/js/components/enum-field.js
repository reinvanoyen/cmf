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
        data[this.props.name] = this.state.value;
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
