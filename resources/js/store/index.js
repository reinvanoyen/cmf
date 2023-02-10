import { createStore } from 'redux';
import rootReducer from '../reducers';
import meta from "../util/meta";

const store = createStore(rootReducer, {
    cmf: {
        title: meta.get('cmf:title'),
        version: meta.get('cmf:version')
    }
});

store.subscribe(() => {
    console.log('Store data updated', store.getState());
});

export default store;
