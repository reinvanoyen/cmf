import React from 'react';

import Dropdown from "../core/ui/dropdown";
import SelectList from "../core/ui/select-list";
import str from "../util/str";

class EnumFilter extends React.Component {

    static defaultProps = {
        id: 0,
        type: '',
        options: {},
        field: '',
        label: '',
        onChange: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            humanReadableValue: 'All'
        };

        this.selectListRef = React.createRef();
    }

    handleChange(values) {

        let readableValues = values.map(value => this.props.options[value]);

        this.setState({
            humanReadableValue: (readableValues.length && readableValues.length !== Object.keys(this.props.options).length ? readableValues.join(', ') : 'All')
        });

        this.props.onChange(this.props.id, values.join(','));
    }

    clear() {
        this.selectListRef.current.clear();
    }

    render() {

        let label = (this.props.label ? this.props.label : str.toUpperCaseFirst(this.props.field));

        return (
            <div className="enum-filter">
                <Dropdown label={label} text={this.state.humanReadableValue}>
                    <SelectList options={this.props.options} onChange={this.handleChange.bind(this)} ref={this.selectListRef} />
                </Dropdown>
            </div>
        );
    }
}

export default EnumFilter;
