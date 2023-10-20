"use strict";

import http from "../util/http";
import meta from "../util/meta";
import store from "../store";

export default {
    path: meta.get('cmf:path'),
    currentPath: {},
    history: [],
    parseLocation(location) {

        const prefix = '/'+this.path+'/';
        const search = location.search;
        const query = new URLSearchParams(search);
        const params = Object.fromEntries(query);
        const request = location.pathname;
        const address = (request.startsWith(prefix) ? request.slice(prefix.length) : '');

        const controller = address.split('/');

        return {
            module: controller[0],
            action: controller[1],
            params: params
        };
    },
    update(module, action, params = {}) {
        store.dispatch({ type: 'location/update', payload: {module, action, params}});
    },
    goTo(module, action, params = {}, newWindow = false) {

        const query = http.query(params);
        const url = `${this.path}/${module}/${action}`+(query ? '?'+query : '');

        if (newWindow) {
            window.open(url);
            return;
        }

        window.history.pushState({}, '', url);

        this.history.push({
            module: module,
            action: action,
            params: params
        });

        this.update(module, action, params);
    },
    refresh() {
        store.dispatch(async (dispatch) => {
            await dispatch({ type: 'location/refresh'});
            dispatch({ type: 'location/stop-refresh'});
        });
    },
    goBack() {
        const {module, action, params} = this.history[this.history.length - 2];
        this.goTo(module, action, params);
    },
    handleRedirect(props, params = {}) {
        if (props.refresh) {
            this.refresh();
        } else if (props.redirectBack) {
            this.goBack();
        } else if (props.redirect) {
            // @TODO parse path, so we can also go to other modules
            // Redirect
            this.goTo(props.path.module, props.redirect, params);
        }
    }
};
