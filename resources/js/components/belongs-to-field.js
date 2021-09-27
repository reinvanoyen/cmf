import React from 'react';
import Field from '../core/ui/field';
import api from '../api/api';

class BelongsToField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        titleField: '',
        allowNull: false
    };

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            data: []
        };
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            if (this.props.data[this.props.name]) {
                this.setState({
                    value: this.props.data[this.props.name].id
                });
            }
        }
    }

    componentDidMount() {
        this.load();
    }

    load() {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', this.props.path.params).then(response => {
            // Set the data to the state
            this.setState({
                value: (this.state.value ? this.state.value : (this.props.allowNull ? '' : response.data[0].id)),
                data: response.data
            });
        });
    }

    render() {

        let options = [];

        if (this.props.allowNull) {
            options.push(
                <option value={''} key={'null'}>
                    -
                </option>
            );
        }

        this.state.data.forEach(row => {
            options.push(
                <option value={row.id} key={row.id}>
                    {row[this.props.titleField]}
                </option>
            );
        });

        return (
            <Field name={this.props.name} label={this.props.label}>
                <div className={'belongs-to-field'}>
                    <select
                        name={this.props.name}
                        className={'belongs-to-field__select'}
                        value={this.state.value}
                        onChange={this.handleChange.bind(this)}
                    >
                        {options}
                    </select>
                </div>
            </Field>
        );
    }
}

export default BelongsToField;
