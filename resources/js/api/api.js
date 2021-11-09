"use strict";

import http from "../util/http";
import ApiError from "../errors/ApiError";
import meta from "../util/meta";

const token = meta.get('csrf');
const api = {};

api.modules = {};
api.execute = {};
api.auth = {};
api.media = {};

/*
* Authentication API
* */

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

/*
* Media API
* */

api.media.upload = (file, directoryId = null) => {

    let body = {
        file: file
    };

    if (directoryId) {
        body.directory = directoryId;
    }

    return api.post('cmf/api/media/upload', http.formData(body));
};

api.media.createDirectory = (name, parentId = null) => {

    let body = {
        name: name
    };

    if (parentId) {
        body.directory = parentId;
    }

    return api.post('cmf/api/media/create-directory', http.formData(body));
};

api.media.renameDirectory = (name, id) => {
    return api.post('cmf/api/media/rename-directory', http.formData({
        name: name,
        directory: id
    }));
};

api.media.deleteDirectory = (id) => {
    return api.post('cmf/api/media/delete-directory', http.formData({
        directory: id
    }));
};

api.media.renameFile = (name, id) => {
    return api.post('cmf/api/media/rename-file', http.formData({
        name: name,
        file: id
    }));
};

api.media.deleteFile = (id) => {
    return api.post('cmf/api/media/delete-file', http.formData({
        file: id
    }));
};

api.media.deleteFiles = (ids) => {
    return api.post('cmf/api/media/delete-files', http.formData({
        files: JSON.stringify(ids)
    }));
};

/*
* Modules API
* */
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

    formData.append('_token', token);

    return fetch(path, {
        credentials: 'include',
        method: 'post',
        body: formData,
        headers: {
            'Accept': 'application/json',
            'X-CSRF-Token': token
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
            'X-CSRF-Token': token
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
