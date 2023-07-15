"use strict";

import './index.scss';

import React from 'react';
import helpers from '../../../util/helpers';

function BooleanSwitcher(props) {
    return (
        <div className={helpers.className('boolean-switcher', props.style)+(props.checked ? ' boolean-switcher--checked' : '')} onClick={props.onClick}></div>
    );
}

BooleanSwitcher.defaultProps = {
    style: [],
    checked: false,
    onClick: () => {}
};

export default BooleanSwitcher;
