import React from 'react';
import http from "../util/http";

class CustomController extends React.Component {

    getControllerUrl() {
        let query = http.query(this.props.path.params);
        let path = `cmf/api/modules/${this.props.path.module}/${this.props.path.action}/${this.props.id}/controller`;
        return path + '?' + query;
    }

    render() {
        return (
            <div className="custom-controller">
                <iframe src={this.getControllerUrl()}></iframe>
            </div>
        );
    }
}

export default CustomController;
