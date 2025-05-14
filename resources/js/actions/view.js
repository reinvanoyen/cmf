import React, {useEffect, useState} from 'react';
import components from "../rendering/components";
import api from "../api/api";

function View(props) {

    if (props.params) {
        props.path.params = props.params;
    }

    const [state, setState] = useState({
        data: {}
    });

    useEffect(() => {
        load();
    }, []);


    const load = () => {
        // Load the data from the backend (with id as param)
        api.execute.get(props.path, props.id,'load', props.path.params).then(response => {
            // Set the data to the state
            setState({
                ...state,
                data: response.data.data
            });
        });
    }

    const render = () => {
        return (
            <div className="view">
                {components.renderComponents(props.components, state.data, props.path)}
            </div>
        );
    }

    return render();
}

View.defaultProps = {
    components: [],
    path: {},
    params: null,
    type: ''
};

export default View;
