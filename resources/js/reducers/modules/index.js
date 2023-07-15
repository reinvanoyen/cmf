const initialState = {
    all: [],
    primary: [],
    secondary: []
};

export default function modulesReducer(state = initialState, action) {
    switch (action.type) {
        case 'modules/update': {
            // We need to return a new state object
            return {
                ...state,
                all: action.payload.all,
                primary: action.payload.primary,
                secondary: action.payload.secondary
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}
