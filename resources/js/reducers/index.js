import { combineReducers } from 'redux'

import cmfReducer from "./cmf";
import authReducer from './auth'
import modulesReducer from "./modules";
import locationReducer from "./location";
import languageReducer from "./language";
import mediaReducer from "./media";

const rootReducer = combineReducers({
    cmf: cmfReducer,
    auth: authReducer,
    location: locationReducer,
    media: mediaReducer,
    modules: modulesReducer,
    language: languageReducer,
});

export default rootReducer;
