"use strict";

export default class ApiError extends Error {
    constructor(body, status, message) {
        super(message);
        this.body = body;
        this.status = status;
        this.name = 'ApiError';
    }
}
