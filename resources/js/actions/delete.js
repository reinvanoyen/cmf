import React from 'react';
import api from "../api/api";
import path from "../state/path";
import ui from "../core/ui/util";
import Button from "../core/ui/button";
import i18n from "../util/i18n";

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
            ui.notify(i18n.get('snippets.singular_deleted', {singular: this.props.singular}));
        });
    }

    redirect() {
        path.handleRedirect(this.props);
    }

    render() {
        return (
            <div className="delete">
                <div className="delete__text">
                    {i18n.get('snippets.delete_singular_title', {singular: this.props.singular})}
                </div>
                <div className="delete__footer">
                    <div className="delete__confirm">
                        <Button onClick={this.delete.bind(this)} text={i18n.get('snippets.delete_singular_confirm', {plural: this.props.singular})} />
                    </div>
                    <div className="delete__cancel">
                        <Button onClick={this.redirect.bind(this)} text={i18n.get('snippets.delete_singular_cancel')} style={'secondary'} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Delete;
