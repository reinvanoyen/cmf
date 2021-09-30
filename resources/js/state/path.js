"use strict";

import http from "../util/http";

export default {
    cmf: null,
    forceRefresh: false,
    currentPath: {},
    history: [],
    setCmf(cmf) {
        this.cmf = cmf;
    },
    parseLocation(location) {

        const prefix = '/admin/';
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
    update(module, action, params) {

        this.currentPath = {
            module: module,
            action: action,
            params: params
        };

        this.cmf.forceUpdate(() => this.forceRefresh = false);
    },
    goTo(module, action, params = {}) {

        let query = http.query(params);

        window.history.pushState({}, '', 'admin/'+module+'/'+action+(query ? '?'+query : ''));

        this.history.push({
            module: module,
            action: action,
            params: params
        });

        this.update(module, action, params);
    },
    refresh() {
        this.cmf.setLoadingState();
        this.forceRefresh = true;
        this.goTo(this.currentPath.module, this.currentPath.action, this.currentPath.params);
    },
    goBack() {

        let {module, action, params} = this.history[this.history.length - 2];
        this.goTo(module, action, params);
    },
    handleRedirect(props, params = {}) {

        if (props.refresh) {

            this.refresh();

        } else if (props.redirectBack) {

            this.goBack();

        } else {

            // @TODO parse path, so we can also go to other modules

            // Redirect
            this.goTo(props.path.module, props.redirect, params);
        }
    }
};
