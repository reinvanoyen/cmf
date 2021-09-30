import React from 'react';
import api from "../api/api";
import path from "../state/path";
import ui from "../core/ui/util";
import Button from "../core/ui/button";

class Delete extends React.Component {

    static defaultProps = {
        type: '',
        components: [],
        path: {},
        id: 0,
        data: {},
        params: null,
        redirect: 'index',
        redirectBack: false,
        singular: '',
        plural: ''
    };

    constructor(props) {
        super(props);

        if (this.props.params) {
            this.props.path.params = this.props.params;
        }
    }

    delete() {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'delete', this.props.path.params).then(response => {

            // Redirect
            this.redirect();

            // Notify the user
            ui.notify(`${this.props.singular} was successfully deleted`);
        });
    }

    redirect() {
        path.handleRedirect(this.props);
    }

    render() {
        return (
            <div className="delete">
                <div className="delete__text">
                    {`Are you sure you wish to delete this ${this.props.singular}?`}
                </div>
                <div className="delete__footer">
                    <div className="delete__confirm">
                        <Button onClick={this.delete.bind(this)} text={`Yes, delete ${this.props.singular}`} />
                    </div>
                    <div className="delete__cancel">
                        <Button onClick={this.redirect.bind(this)} text={'No'} style={'secondary'} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Delete;
