"use strict";

const meta = {
    get(name) {
        let metaEl = document.querySelector('meta[name="'+name+'"]');
        if (metaEl) {
            return metaEl.getAttribute('content');
        }
        return null;
    }
};

export default meta;
