"use strict";

export default {
    query(obj) {
        return Object.keys(obj).map(key => key + '=' + obj[key]).join('&');
    },
    formData(obj) {
        let formData = new FormData();
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                formData.append(key, obj[key]);
            }
        }
        return formData;
    }
};
