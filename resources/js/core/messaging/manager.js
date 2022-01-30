"use strict";

export default class Manager {

    static eventQueue = {};

    static on(event_name, callback) {
        if (typeof this.eventQueue[event_name] == 'undefined') {
            this.eventQueue[event_name] = [];
        }
        this.eventQueue[event_name].push(callback);
    };

    static off(event_name, callback) {
        if (this.eventQueue[event_name]) {
            this.eventQueue[event_name] = this.eventQueue[event_name].filter(cb => cb !== callback);
        }
    }

    static trigger(event_name, event) {
        if (typeof this.eventQueue[event_name] != 'undefined') {
            this.eventQueue[event_name].forEach(e => {
                e(event);
            });
        }
    };
}
