import React from 'react';
import UiDropdown from "../core/ui/dropdown";
import LinkList from "../core/ui/link-list";

export default function Dropdown(props) {

    const goTo = (actionPath) => {

        let params = {};

        if (props.data && props.data.id) {
            params.id = props.data.id;
        } else if (props.path.params.id) {
            params.id = props.path.params.id;
        }

        dispatch({type: 'location/update', payload: {module: props.path.module, actionPath, params}});
    }

    const render = () => {
        return (
            <UiDropdown text={props.text} style={props.style}>
                <LinkList links={props.links} onClick={actionPath => goTo(actionPath)} />
            </UiDropdown>
        );
    }

    return render();
}
