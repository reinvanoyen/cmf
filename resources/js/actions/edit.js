import React from 'react';
import components from "../rendering/components";
import Form from "../core/ui/form";
import api from "../api/api";
import path from "../state/path";
import http from "../util/http";
import ui from "../core/ui/util";

class Edit extends React.Component {

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

        this.state = {
            data: {}
        };

        this.formRef = React.createRef();
    }

    componentDidMount() {
        this.load();
    }

    load() {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', this.props.path.params).then(response => {
            // Set the data to the state
            this.setState({
                data: response.data
            });
        });
    }

    save(data) {

        // Add the id to the data first
        data.id = this.props.path.params.id;

        // Post the data to the backend
        api.execute.post(this.props.path, this.props.id,'save', http.formData(data))
            .then(response => {

                this.formRef.current.ready();

                this.redirect(response);

                // Notify the user
                ui.notify('Save was successful');
            }, error => {

                this.formRef.current.ready();

                // @TODO standardize validation error handling
                for (let k in error.body.errors) {
                    ui.notify(error.body.errors[k]);
                }
            });
    }

    redirect(response) {

        if (this.props.redirectBack) {

            path.goBack();

        } else {
            // Redirect
            path.goTo(this.props.path.module, this.props.redirect, {
                id: response.data.id
            });
        }
    }

    render() {

        let componentList = components.renderComponents(this.props.components, this.state.data, this.props.path);

        return (
            <div className="edit">
                <Form
                    ref={this.formRef}
                    onSubmit={this.save.bind(this)}
                    submitButtonText={'Save'}
                >
                    {componentList}
                </Form>
            </div>
        );
    }
}

export default Edit;
