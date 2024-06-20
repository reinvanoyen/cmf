import React, {useState, useEffect} from 'react';

import Dropdown from "../core/ui/dropdown";
import SelectList from "../core/ui/select-list";
import str from "../util/str";
import api from "../api/api";
import useOnMount from "../hooks/use-on-mount";

function BelongsToFilter(props) {

    const [state, setState] = useState({
        hasLoadedOptions: false,
        values: [],
        options: {},
        humanReadableValue: 'All'
    });

    const buildValue = value => `value_${value}`;
    const unbuildValue = value => parseInt(value.slice(('value_').length));
    const makeHumanReadableList = list => {
        if (! list.length) {
            return 'All';
        }
        if (list.length > 3) {
            return `${list[0]} and ${list.length-1} more`;
        }
        return list.join(', ');
    };

    const loadFilterOptions = async () => {

        const response = await api.execute.get(props.path, props.id,'loadOptions', props.path.params);
        const data = response.data.data;
        const defaultValues = response.data.default;

        const options = {};
        data.forEach(row => {
            options[buildValue(row.id)] = row[props.titleColumn];
        });

        setState({
            ...state,
            hasLoadedOptions: true,
            defaultValues,
            options,
        });
    };

    useOnMount(() => {
        const isFiltering = Object.keys(props.data).length;

        if (! isFiltering) {

            props.onChange(props.id, props.defaultValues.map(value => value.id).join(','));

        } else {
            loadFilterOptions();
        }
    });

    useEffect(() => {
        if (! state.hasLoadedOptions) {
            loadFilterOptions();
        }
    }, [state.hasLoadedOptions]);

    useEffect(() => {

        const values = (props.data['filter_'+props.id] ? props.data['filter_'+props.id].split(',').map(v => parseInt(v)) : []);
        const readableValues = values.map(value => state.options[buildValue(value)]);

        setState({
            ...state,
            values,
            humanReadableValue: makeHumanReadableList(readableValues),
        });

    }, [props.data, state.hasLoadedOptions]);

    const handleChange = (values = []) => {
        values = values.map(value => unbuildValue(value)).join(',');
        props.onChange(props.id, values);
    };

    const render = () => {

        const label = (props.label ? props.label : str.toUpperCaseFirst(props.field));

        return (
            <div className="enum-filter">
                <Dropdown
                    stopPropagation={false}
                    autoCloseOnContentClick={false}
                    style={['secondary']}
                    label={label}
                    text={state.humanReadableValue}
                >
                    <SelectList
                        options={state.options}
                        defaultValues={state.values.map(value => buildValue(value))}
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
    usesDefaultValues: false,
    defaultValues: [],
    data: {},
    onChange: () => {}
};

export default BelongsToFilter;
