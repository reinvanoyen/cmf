"use strict";

import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from 'react-redux';
import store from "./store";

import Cmf from "./core/cmf";

const rootEl = document.querySelector('.cmf-mount');
const root = createRoot(rootEl);

root.render(
    <Provider store={store}>
        <Cmf />
    </Provider>,
);
