import React from 'react';
import dom from "../util/dom";
import Field from "../core/ui/field";

export default class Checkbox extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        disabled: false,
        showRequiredIndicator: false
    };

    constructor(props) {
        super(props);

        this.state = {
            value: false
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
            value: (e.target.checked ? 1 : 0)
        });
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;
    }

    render() {

        return (
            <Field name={this.props.name} required={this.props.showRequiredIndicator} label={this.props.label}>
                <input id={dom.inputId(this.props.name)}
                       name={this.props.name}
                       className="checkbox"
                       type="checkbox"
                       checked={(this.state.value === 1)}
                       disabled={this.props.disabled}
                       onChange={this.handleChange.bind(this)}
                       onKeyUp={this.handleChange.bind(this)}
                />
            </Field>
        );
    }
}
