import { createStore } from 'redux';
import rootReducer from '../reducers';

const store = createStore(rootReducer);

store.subscribe(() => {
    console.log('Store data updated', store.getState());
});

export default store;
