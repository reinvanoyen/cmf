import React, {useState, useEffect} from 'react';

import Dropdown from "../core/ui/dropdown";
import SelectList from "../core/ui/select-list";
import str from "../util/str";
import api from "../api/api";
import useOnMount from "../hooks/use-on-mount";

function BelongsToFilter(props) {

    const [state, setState] = useState({
        values: (props.data['filter_'+props.id] ? props.data['filter_'+props.id].split(',').map(v => parseInt(v)) : []),
        options: {},
        humanReadableValue: 'All'
    })

    useOnMount(() => {

        // Load the data from the backend (with id as param)
        api.execute.get(props.path, props.id,'load', props.path.params).then(response => {

            const options = {};
            const data = response.data.data;

            data.forEach(row => {
                options[row.id] = row[props.titleColumn];
            });

            const readableValues = state.values.map(value => options[parseInt(value)]);

            setState({
                ...state,
                options,
                humanReadableValue: (readableValues.length ? readableValues.join(', ') : 'All')
            });
        });
    })

    useEffect(() => {

        const values = (props.data['filter_'+props.id] ? props.data['filter_'+props.id].split(',').map(v => parseInt(v)) : [])
        const readableValues = values.map(value => state.options[parseInt(value)]);

        setState({
            ...state,
            values,
            humanReadableValue: (readableValues.length ? readableValues.join(', ') : 'All')
        });

    }, [props.data])

    const handleChange = (values = []) => {
        props.onChange(props.id, values.join(','));
    };

    const render = () => {

        const label = (props.label ? props.label : str.toUpperCaseFirst(props.field));

        return (
            <div className="enum-filter">
                <Dropdown stopPropagation={false} style={['secondary']} label={label} text={state.humanReadableValue}>
                    <SelectList
                        options={state.options}
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

BelongsToFilter.defaultProps = {
    id: 0,
    type: '',
    field: '',
    label: '',
    titleColumn: '',
    data: {},
    onChange: () => {}
};

export default BelongsToFilter;
