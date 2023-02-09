const initialState = {
    language: null
};

export default function languageReducer(state = initialState, action) {
    switch (action.type) {
        case 'language/update': {
            // We need to return a new state object
            return {
                ...state,
                language: action.payload
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}
