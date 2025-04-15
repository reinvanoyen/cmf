import React from 'react';
import Field from "../core/ui/field";

function BooleanStatusView(props) {

    if (props.data && typeof props.data[props.name] !== 'undefined') {
        return (
            <Field name={props.name} label={props.label}>
                <span className={'boolean-status-view boolean-status-view--'+(props.data[props.name] ? 'checked' : 'unchecked')}>
                    {props.data[props.name] ? props.trueStringLiteral : props.falseStringLiteral}
                </span>
            </Field>
        );
    }

    return null;
}

BooleanStatusView.defaultProps = {
    path: {},
    data: {},
    name: '',
    trueStringLiteral: '',
    falseStringLiteral: '',
    action: '',
    style: null
};

export default BooleanStatusView;
