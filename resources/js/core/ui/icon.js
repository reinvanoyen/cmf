import React from 'react';
import helpers from "../../util/helpers";

function Icon(props) {

    const onClick = e => {
        e.stopPropagation();
        props.onClick();
    };

    return (
        <span className={helpers.className('icon', props.style)} onClick={props.onClick ? onClick : null}>
            {props.name}
        </span>
    );
}

Icon.defaultProps = {
    'text': '',
    'type': 'icon',
    'style': [],
    'name': 'fingerprint',
    onClick: null
};

export default Icon;
