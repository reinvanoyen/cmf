import React from 'react';
import Field from '../core/ui/field';
import api from '../api/api';

class BelongsToField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        titleColumn: '',
        nullable: false
    };

    constructor(props) {
        super(props);

        this.state = {
            value: (this.props.data[this.props.name] ? this.props.data[this.props.name].id : ''),
            options: []
        };
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;
    }

    handleChange(e) {
        this.setState({
            value: (e.target.value ? parseInt(e.target.value) : '')
        });
    }

    getData(data) {
        data[this.props.name] = (this.state.value ? this.state.options.find(opt => opt.id === this.state.value) : null);
        return data;
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

            let options = response.data.data;
            let value = this.state.value ? this.state.value : (this.props.nullable ? '' : options[0].id);

            // Set the data to the state
            this.setState({value, options});
        });
    }

    render() {

        let options = [];

        if (this.props.nullable) {
            options.push(
                <option value={''} key={'null'}>
                    -
                </option>
            );
        }

        this.state.options.forEach(row => {
            options.push(
                <option value={row.id} key={row.id}>
                    {row[this.props.titleColumn]}
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
