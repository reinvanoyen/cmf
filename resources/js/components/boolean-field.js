import React from 'react';
import Field from "../core/ui/field";

export default class BooleanField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
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
                value: (this.props.data[this.props.name] === 1)
            });
        }
    }

    handleSubmit(data) {
        data[this.props.name] = (this.state.value ? 1 : 0);
    }

    switch() {
        this.setState({
            value: ! this.state.value
        });
    }

    render() {
        return (
            <Field name={this.props.name} label={this.props.label}>
                <div className={'boolean-field boolean-field--'+(this.state.value ? 'checked' : 'unchecked')} onClick={this.switch.bind(this)}>
                    {this.state.value ? 'Yes' : 'No'}
                </div>
            </Field>
        );
    }
}
