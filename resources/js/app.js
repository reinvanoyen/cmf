"use strict";

import ReactDOM from "react-dom";
import React from "react";
import Cmf from "./core/cmf";

const cmfMountEl = document.querySelector('.cmf-mount');

if (cmfMountEl) {
    ReactDOM.render(<Cmf title={cmfMountEl.dataset.title} />, cmfMountEl);
}
