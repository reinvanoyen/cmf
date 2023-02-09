import React from 'react';
import Button from "../core/ui/button";
import UiLink from "../core/ui/link";
import { useDispatch } from "react-redux";
import path from "../state/path";

export default function Link(props) {

    /*
    static defaultProps = {
        path: {},
        data: {},
        action: '',
        back: false,
        style: null
    };
    */
    const dispatch = useDispatch();

    const goTo = () => {

        if (props.back) {
            path.goBack();
            return;
        }

        let params = {};

        if (props.data && props.data.id) {
            params.id = props.data.id;
        } else if (props.path.params.id) {
            params.id = props.path.params.id;
        }

        dispatch({ type: 'location/update', payload: {module: props.path.module, action: props.action, params} });
    }

    const render = () => {

        if (props.style && props.style !== 'alt') {
            return <Button style={props.style} text={props.text} onClick={goTo} />;
        }

        return <UiLink style={props.style} onClick={goTo} text={props.text} />;
    }

    return render();
}
