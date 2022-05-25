"use strict";

import axios from 'axios';
import http from "../util/http";
import ApiError from "../errors/ApiError";
import meta from "../util/meta";
import util from "../core/ui/util";

const setCsrfToken = token => {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
};

axios.defaults.withCredentials = true;
setCsrfToken(meta.get('csrf'));

axios.interceptors.request.use((config) => {
    document.body.classList.add('api-loading');
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(response => {
    // HTTP response 2xx
    document.body.classList.remove('api-loading');
    return response;
}, error => {
    // HTTP response other than 2xx
    document.body.classList.remove('api-loading');
    return Promise.reject(error);
});

const api = {};

api.modules = {};
api.execute = {};
api.auth = {};
api.media = {};

/*
* Authentication API
* */

api.auth.user = () => axios.get('cmf/api/auth/user');
api.auth.logout = () => axios.get('cmf/api/auth/logout');
api.auth.sessionInfo = () => axios.get('cmf/api/auth/session-info');
api.auth.keepAlive = () => axios.post('cmf/api/auth/csrf-keep-alive');
api.auth.login = (email, password) => {
    return axios.post('cmf/api/auth/login', {email, password});
};

/*
* Media API
* */

api.media.upload = (file, directoryId = null, onUploadProgress = () => {}) => {

    let body = {
        file: file
    };

    if (directoryId) {
        body.directory = directoryId;
    }

    return axios.post('cmf/api/media/upload', http.formData(body), {onUploadProgress});
};

api.media.uploadChunk = (status, filename, path, chunk, directoryId = null) => {

    let body = {status, filename, chunk};

    if (path) {
        body.path = path;
    }

    if (directoryId) {
        body.directory = directoryId;
    }

    return axios.post('cmf/api/media/upload-chunk', http.formData(body));
};

api.media.path = (id = null) => {

    let body = {};

    if (id) {
        body.directory = id;
    }

    return axios.get('cmf/api/media/path', {params: body});
};

api.media.loadDirectories = (id = null) => {

    let body = {};

    if (id) {
        body.directory = id;
    }

    return axios.get('cmf/api/media/load-directories', {params: body});
};

api.media.loadFiles = (id = null) => {

    let body = {};

    if (id) {
        body.directory = id;
    }

    return axios.get('cmf/api/media/load-files', {params: body});
};

api.media.createDirectory = (name, parentId = null) => {

    let body = {name};

    if (parentId) {
        body.directory = parentId;
    }

    return axios.post('cmf/api/media/create-directory', body);
};

api.media.renameDirectory = (name, directory) => {
    return axios.post('cmf/api/media/rename-directory', {name, directory});
};

api.media.deleteDirectory = directory => {
    return axios.post('cmf/api/media/delete-directory', {directory});
};

api.media.renameFile = (name, file) => {
    return axios.post('cmf/api/media/rename-file', {name, file});
};

api.media.deleteFile = (file) => {
    return axios.post('cmf/api/media/delete-file', {file});
};

api.media.deleteFiles = (fileIds) => {
    return axios.post('cmf/api/media/delete-files', {
        files: JSON.stringify(fileIds)
    });
};

api.media.labelFile = (label, file) => {
    return axios.post('cmf/api/media/label-file', {label, file});
};

api.media.updateFileDescription = (description, file) => {
    return axios.post('cmf/api/media/update-file-description', {description, file});
};

api.media.updateFileCopyright = (copyright, file) => {
    return axios.post('cmf/api/media/update-file-copyright', {copyright, file});
};

api.media.updateFileVisibility = (visibility, file) => {
    return axios.post('cmf/api/media/update-file-visibility', {visibility, file});
};

api.media.updateFilesDescription = (description, fileIds) => {
    return axios.post('cmf/api/media/update-files-description', {description, files: JSON.stringify(fileIds)});
};

api.media.updateFilesCopyright = (copyright, fileIds) => {
    return axios.post('cmf/api/media/update-files-copyright', {copyright, files: JSON.stringify(fileIds)});
};

api.media.moveFile = (directory, file) => {
    return axios.post('cmf/api/media/move-file', {directory, file});
};

api.media.moveFiles = (directory, fileIds) => {
    return axios.post('cmf/api/media/move-files', {
        directory: directory,
        files: JSON.stringify(fileIds)
    });
};

/*
* Modules API
* */
api.modules.index = () => axios.get(`cmf/api/modules`);

api.modules.action = (path, params = {}) => {
    return axios.get(`cmf/api/modules/${path.module}/${path.action}`, {params});
};

api.execute.get = (path, id, execute, params = {}) => {
    return axios.get(`cmf/api/modules/${path.module}/${path.action}/${id}/${execute}`, {params});
};

api.execute.post = (path, id, execute, params) => {
    return axios.post(`cmf/api/modules/${path.module}/${path.action}/${id}/${execute}`, http.formData(params));
};

export default api;
