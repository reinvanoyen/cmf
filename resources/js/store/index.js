import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import meta from "../util/meta";
import localStorage from "../util/local-storage";
import {composeWithDevToolsDevelopmentOnly} from "@redux-devtools/extension";

const composeEnhancers = composeWithDevToolsDevelopmentOnly({});

const store = createStore(rootReducer, {
    cmf: {
        title: meta.get('cmf:title'),
        version: meta.get('cmf:version')
    },
    media: {
        viewMode: localStorage.get('media-view-mode', 'list')
    }
}, composeEnhancers(applyMiddleware(thunk)));

export default store;
