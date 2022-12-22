"use strict";

const i18n = {
    get(string, params = {}) {
        let parts = string.split('.');
        let value = window.i18n;
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            if (! value[part]) {
                return string;
            }
            value = value[part];
        }
        for (let param in params) {
            value = value.replace(`:${param}`, params[param]);
        }
        return value;
    }
};

export default i18n;
