const initialState = {
    isInitialised: false,
    viewMode: 'list',
    directory: null,
    path: [],
    directories: [],
    files: []
};

export default function mediaReducer(state = initialState, action) {
    switch (action.type) {
        case 'media/init': {
            return {
                ...state,
                isInitialised: true,
                directory: action.payload.directory,
                path: action.payload.path,
                directories: action.payload.directories,
                files: action.payload.files
            }
        }
        case 'media/path/update': {
            return {
                ...state,
                path: action.payload
            }
        }
        case 'media/directory/update': {
            return {
                ...state,
                directory: action.payload
            }
        }
        case 'media/directories/update': {
            return {
                ...state,
                directories: action.payload
            }
        }
        case 'media/directories/rename': {

            const directories = [...state.directories].map(directory => {
                return {
                    ...directory,
                    name: (directory.id === action.payload.id ? action.payload.name : directory.name)
                };
            });

            return {
                ...state,
                directories
            }
        }
        case 'media/directories/delete': {
            return {
                ...state,
                directories: state.directories.filter(directory => ! action.directoryIds.includes(directory.id))
            }
        }
        case 'media/directories/add': {
            return {
                ...state,
                directories: [...state.directories, action.payload]
            }
        }
        case 'media/files/delete': {
            return {
                ...state,
                files: state.files.filter(file => ! action.fileIds.includes(file.id))
            }
        }
        case 'media/files/add': {
            return {
                ...state,
                files: [...state.files, action.payload]
            }
        }
        case 'media/files/rename': {

            const files = [...state.files].map(file => {
                return {
                    ...file,
                    name: (file.id === action.payload.id ? action.payload.name : file.name)
                };
            });

            return {
                ...state,
                files
            }
        }
        case 'media/files/update': {
            return {
                ...state,
                files: action.payload
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
