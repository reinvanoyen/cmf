"use strict";

export default {
    filter(object, predicate) {
        return Object.keys(object)
            .filter(key => predicate(object[key]))
            .reduce((res, key) => (res[key] = object[key], res), {});

    }
};
