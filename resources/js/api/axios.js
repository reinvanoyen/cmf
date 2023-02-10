"use strict";

import axios from 'axios';
import meta from "../util/meta";

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-CSRF-TOKEN'] = meta.get('csrf');

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

export default axios;
