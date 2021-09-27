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
        redirectBack: false
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
            ui.notify('Item was deleted');
        });
    }

    redirect() {
        if (this.props.redirectBack) {
            path.goBack();
        } else {
            // Redirect
            path.goTo(this.props.path.module, this.props.redirect);
        }
    }

    render() {
        return (
            <div className="delete">
                <div className="delete__text">
                    Are you sure you wish to delete this item?
                </div>
                <div className="delete__footer">
                    <Button onClick={this.delete.bind(this)} text={'Yes, delete item'} />
                    <Button onClick={this.redirect.bind(this)} text={'No'} style={'outline'} />
                </div>
            </div>
        );
    }
}

export default Delete;
