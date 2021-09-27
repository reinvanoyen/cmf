"use strict";

import http from "../util/http";
import ApiError from "../errors/ApiError";
import meta from "../util/meta";

let api = {};

api.modules = {};
api.execute = {};
api.auth = {};

api.auth.user = () => {
    return api.get(`cmf/api/auth/user`);
};

api.auth.login = (email, password) => {
    return api.post('cmf/api/auth/login', http.formData({
        email: email,
        password: password
    }));
};

api.auth.logout = () => {
    return api.get('cmf/api/auth/logout');
};

api.modules.index = () => {
    return api.get(`cmf/api/modules`);
};

api.modules.action = (path, params = {}) => {
    return api.get(`cmf/api/modules/${path.module}/${path.action}`, params);
};

api.execute.get = (path, id, execute, params = {}) => {
    return api.get(`cmf/api/modules/${path.module}/${path.action}/${id}/${execute}`, params);
};

api.execute.post = (path, id, execute, formData) => {
    return api.post(`cmf/api/modules/${path.module}/${path.action}/${id}/${execute}`, formData);
};

// HTTP Methods

api.post = (path, formData) => {

    document.body.classList.add('api-loading');

    return fetch(path, {
        credentials: 'include',
        method: 'post',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'X-CSRF-Token': meta.get('csrf')
        }
    }).then(response => {

        document.body.classList.remove('api-loading');

        let json = response.json();

        return json.then(json => {
            if (response.ok) {
                return json;
            }
            throw new ApiError(json, response.status, response.statusText);
        });
    });
};

api.get = (path, params = {}) => {

    document.body.classList.add('api-loading');

    let query = http.query(params);

    return fetch(path + '?' + query, {
        credentials: 'include',
        method: 'get',
        headers: {
            'X-CSRF-Token': meta.get('csrf')
        },
    }).then(response => {

        document.body.classList.remove('api-loading');

        let json = response.json();

        return json.then(json => {
            if (response.ok) {
                return json;
            }
            throw new ApiError(json, response.status, response.statusText);
        });
    });
};

export default api;
