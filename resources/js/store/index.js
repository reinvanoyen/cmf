import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import meta from "../util/meta";

const store = createStore(rootReducer, {
    cmf: {
        title: meta.get('cmf:title'),
        version: meta.get('cmf:version')
    }
}, applyMiddleware(thunk));

export default store;
