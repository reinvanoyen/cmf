"use strict";

export default {
    get(key, def = null) {
        const item = window.localStorage.getItem(key);

        if (! item && def !== null) {
            return def;
        }

        return item;
    },
    set(key, value) {
        window.localStorage.setItem(key, value);
    },
    remove(key) {
        window.localStorage.removeItem(key);
    },
    clear() {
        window.localStorage.clear();
    }
};
