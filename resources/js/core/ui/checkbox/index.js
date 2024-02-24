"use strict";

import './index.scss';

import React from 'react';
import helpers from '../../../util/helpers';

function Checkbox(props) {
    return (
        <div className={helpers.className('checkbox', props.style)+(props.checked ? ' checkbox--checked' : '')} onClick={props.onClick}></div>
    );
}

Checkbox.defaultProps = {
    style: [],
    checked: false,
    onClick: () => {}
};

export default Checkbox;
