"use strict";

import React from 'react';
import Title from "./title";

function TextBlock(props) {
    return (
        <div className={'text-block'}>
            <Title>{props.title}</Title>
            <div>
                {props.text}
            </div>
        </div>
    );
}

TextBlock.defaultProps = {
    title: null,
    text: null
};

export default TextBlock;
