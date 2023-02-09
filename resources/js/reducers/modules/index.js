const initialState = {
    modules: []
};

export default function modulesReducer(state = initialState, action) {
    switch (action.type) {
        case 'modules/update': {
            // We need to return a new state object
            return {
                ...state,
                modules: action.payload
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}
