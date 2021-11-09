"use strict";

export default {
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
