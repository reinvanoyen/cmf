import React, {useEffect, useState} from 'react';
import helpers from "../../util/helpers";
import useOnMount from "../../hooks/use-on-mount";

function Icon(props) {

    const [state, setState] = useState({
        style: props.style
    });

    const onClick = e => {
        e.stopPropagation();
        props.onClick();
    };

    useOnMount(() => {
        if (props.onClick) {
            setState({
                ...state,
                style: [...state.style, 'icon--clickable']
            });
        }
    });

    return (
        <span className={helpers.className('icon', state.style)} onClick={props.onClick ? onClick : null}>
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
