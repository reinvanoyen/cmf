import React, {useEffect, useState} from 'react';

import Dropdown from "../core/ui/dropdown";
import SelectList from "../core/ui/select-list";
import str from "../util/str";
import {useSelector} from "react-redux";

function EnumFilter(props) {

    const [state, setState] = useState({
        values: [],
        humanReadableValue: 'All'
    });

    useEffect(() => {

        const values = props.data['filter_'+props.id] ? props.data['filter_'+props.id].split(',') : [];

        setState({
            ...state,
            values,
            humanReadableValue: (values.length ? values.join(', ') : 'All')
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

EnumFilter.defaultProps = {
    id: 0,
    type: '',
    options: {},
    field: '',
    label: '',
    data: {},
    onChange: () => {}
};

export default EnumFilter;
