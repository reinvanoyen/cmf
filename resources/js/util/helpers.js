"use strict";

export default {
    scrollTop() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    className(base, modifiers = '') {

        if (! modifiers) {
            return base;
        }

        if (typeof modifiers === 'string') {
            modifiers = [modifiers];
        }

        let seperator = ' '+base+'--';

        return base+(modifiers ? seperator+modifiers.join(seperator) : '');
    },
    shallowEqual(object1 = {}, object2 = {}) {

        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (object1[key] !== object2[key]) {
                return false;
            }
        }

        return true;
    }
};
