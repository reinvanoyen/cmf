import React, {useEffect, useState} from 'react';

import Dropdown from "../core/ui/dropdown";
import SelectList from "../core/ui/select-list";
import str from "../util/str";

function QueryFilter(props) {

    const [state, setState] = useState({
        values: [],
        humanReadableValue: 'All'
    });

    useEffect(() => {

        const values = props.data['filter_'+props.id] ? props.data['filter_'+props.id].split(',') : [];
        const readableValues = values.map(value => props.options[value]).filter(value => value);

        setState({
            ...state,
            values,
            humanReadableValue: (readableValues.length ? readableValues.join(', ') : 'All')
        });
    }, [props.data]);

    const handleChange = (values = []) => {
        props.onChange(props.id, values.join(','));
    }

    const render = () => {

        const label = (props.label ? props.label : str.toUpperCaseFirst(props.field));

        return (
            <div className="enum-filter">
                <Dropdown stopPropagation={false} style={['secondary']} label={label} text={state.humanReadableValue}>
                    <SelectList
                        options={props.options}
                        defaultValues={state.values}
                        onChange={handleChange}
                        onClear={handleChange}
                    />
                </Dropdown>
            </div>
        );
    }

    return render();
}

QueryFilter.defaultProps = {
    id: 0,
    type: '',
    options: {},
    field: '',
    label: '',
    data: {},
    onChange: () => {}
};

export default QueryFilter;
