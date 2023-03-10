"use strict";

import React, { useState, useEffect } from 'react';
import usePrevious from "../../hooks/use-previous";

function Thumbnail(props) {

    const [state, setState] = useState({
        isLoaded: false
    });

    const prevSrc = usePrevious(props.src);

    useEffect(() => {
        if (prevSrc !== props.src) {
            setState({
                ...state,
                isLoaded: false
            });
        }
    }, [props]);

    useEffect(() => {
        if (! state.isLoaded) {

            let img = new Image();
            img.onload = () => { loaded(); };
            img.src = props.src;

            return () => {
                img.onload = () => {};
            };
        }
    }, [state.isLoaded]);

    const loaded = () => {
        setState({
            ...state,
            isLoaded: true
        });
    };

    return (
        <div className={'thumb' + (state.isLoaded ? ' thumb--loaded' : '')}>
            <img src={props.src} className="thumb__img" />
        </div>
    );
}

Thumbnail.defaultProps = {
    src: '',
    autoload: true,
    onLoaded: () => {}
};

export default Thumbnail;
