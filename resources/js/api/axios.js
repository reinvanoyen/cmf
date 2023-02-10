"use strict";

import axios from 'axios';
import meta from "../util/meta";

const axiosInstance = axios.create();

axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = meta.get('csrf');

axiosInstance.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 419 && !originalRequest._retry) {
        originalRequest._retry = true;

        const sessionInfo = await axios.get('cmf/api/auth/session-info');
        const csrfToken = sessionInfo.data.data.csrfToken;

        axiosInstance.defaults.headers.common['X-CSRF-TOKEN'] = sessionInfo.data.data.csrfToken;

        const newRequestConfig = {...originalRequest};
        newRequestConfig.headers['X-CSRF-TOKEN'] = csrfToken;

        return new axiosInstance(newRequestConfig);
    }

    throw error;
});

axiosInstance.interceptors.request.use((config) => {
    document.body.classList.add('api-loading');
    return config;
}, error => {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axiosInstance.interceptors.response.use(response => {
    // HTTP response 2xx
    document.body.classList.remove('api-loading');
    return response;
}, error => {
    // HTTP response other than 2xx
    document.body.classList.remove('api-loading');
    return Promise.reject(error);
});

export default axiosInstance;
