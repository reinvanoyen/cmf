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
    }
};
