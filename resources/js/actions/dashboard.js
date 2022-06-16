import React from 'react';
import components from '../rendering/components';

class Dashboard extends React.Component {

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
    }

    render() {

        let componentList = components.renderComponents(this.props.components, {}, this.props.path);

        return (
            <div className="dashboard">
                {componentList}
            </div>
        );
    }
}

export default Dashboard;
