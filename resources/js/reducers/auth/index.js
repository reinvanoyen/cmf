const initialState = {
    user: null
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'auth/loggedin': {
            // We need to return a new state object
            return {
                ...state,
                user: action.payload
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}
