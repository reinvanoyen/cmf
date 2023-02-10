const initialState = {
    isLoggedIn: false,
    user: null
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'auth/loggedin': {
            // We need to return a new state object
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }
        }
        case 'auth/loggedout': {
            // We need to return a new state object
            return {
                ...state,
                isLoggedIn: false,
                user: null
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}
