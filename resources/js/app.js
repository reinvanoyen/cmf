"use strict";

import React from "react";
import { render } from "react-dom";
import { Provider } from 'react-redux';
import store from "./store";

import Cmf from "./core/cmf";

const cmfMountEl = document.querySelector('.cmf-mount');

render(
    <Provider store={store}>
        <Cmf title={cmfMountEl.dataset.title} />
    </Provider>,
    cmfMountEl
);
