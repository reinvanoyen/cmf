"use strict";

export default {
    language: null,
    set(lang) {
        this.language = lang;
    },
    get() {
        return this.language;
    }
};
