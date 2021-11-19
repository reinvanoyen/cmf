import React from 'react';
import components from "../rendering/components";
import api from "../api/api";

class View extends React.Component {

    static defaultProps = {
        components: [],
        path: {},
        params: null,
        type: ''
    };

    constructor(props) {
        super(props);

        if (this.props.params) {
            this.props.path.params = this.props.params;
        }

        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        this.load();
    }

    load() {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', this.props.path.params).then(response => {

            // Set the data to the state
            this.setState({
                data: response.data.data
            });
        });
    }

    render() {

        let componentList = components.renderComponents(this.props.components, this.state.data, this.props.path);

        return (
            <div className="view">
                {componentList}
            </div>
        );
    }
}

export default View;
