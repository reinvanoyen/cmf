"use strict";

import './index.scss';

import React from 'react';
import helpers from '../../../util/helpers';

function RadioButton(props) {
    return (
        <div className={helpers.className('radiobutton', props.style)+(props.checked ? ' radiobutton--checked' : '')} onClick={props.onClick}></div>
    );
}

RadioButton.defaultProps = {
    style: [],
    checked: false,
    onClick: () => {}
};

export default RadioButton;
