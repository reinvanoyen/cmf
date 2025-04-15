import React from 'react';
import UIIcon from "../core/ui/icon";
import path from "../state/path";

function Icon(props) {

    const goTo = () => {

        const toUrl = props.data[`${props.id}_to_url_icon`];

        if (toUrl) {
            window.open(toUrl);
            return;
        }

        let params = {};

        if (props.data && props.data.id) {
            params.id = props.data.id;
        } else if (props.path.params.id) {
            params.id = props.path.params.id;
        }

        path.goTo(props.path.module, props.action, params);
    }

    return (
        <UIIcon name={props.name} style={['clickable']} onClick={goTo} />
    );
}

Icon.defaultProps = {
    path: {},
    data: {},
    name: '',
    action: '',
    style: null
};

export default Icon;
