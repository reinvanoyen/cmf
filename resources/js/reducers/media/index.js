const initialState = {
    viewMode: 'list',
    currentDirectory: null,
    directories: [],
    files: []
};

export default function mediaReducer(state = initialState, action) {
    switch (action.type) {
        case 'media/directory/update': {
            return {
                ...state,
                currentDirectory: action.payload
            }
        }
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
