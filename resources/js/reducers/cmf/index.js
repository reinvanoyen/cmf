const initialState = {
    title: 'CMF',
    version: null
};

export default function cmfReducer(state = initialState, action) {
    switch (action.type) {
        case 'cmf/update': {
            // We need to return a new state object
            return {
                ...state,
                title: action.payload.title,
                version: action.payload.version
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}
