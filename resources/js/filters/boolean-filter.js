import React, {useState, useEffect} from 'react';

import str from "../util/str";
import BooleanSwitcher from "../core/ui/boolean-switcher";

function BooleanFilter(props) {

    const [state, setState] = useState({
        value: false
    });

    useEffect(() => {

        const value = props.data['filter_'+props.id] ? (String(props.data['filter_'+props.id]) === 'true') : false;

        setState({
            ...state,
            value
        });

    }, [props.data]);

    const handleChange = () => {
        props.onChange(props.id, ! state.value);
    }

    const render = () => {

        const label = (props.label ? props.label : str.toUpperCaseFirst(props.field));

        return (
            <div className="boolean-filter" onClick={handleChange}>
                <div className="boolean-filter__label">
                    {label}
                </div>
                <BooleanSwitcher checked={state.value} style={['alt', 'small']} />
            </div>
        );
    }

    return render();
}

BooleanFilter.defaultProps = {
    id: 0,
    type: '',
    field: '',
    label: '',
    data: {},
    onChange: () => {}
};

export default BooleanFilter;
