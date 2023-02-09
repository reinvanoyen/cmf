const initialState = {
    viewMode: 'list'
};

export default function mediaReducer(state = initialState, action) {
    switch (action.type) {
        case 'media/view/update': {
            // We need to return a new state object
            return {
                ...state,
                viewMode: action.payload
            }
        }
        default:
            // If this reducer doesn't recognize the action type, or doesn't
            // care about this specific action, return the existing state unchanged
            return state;
    }
}
