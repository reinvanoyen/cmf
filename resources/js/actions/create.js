import React from 'react';
import components from "../rendering/components";
import Form from "../core/ui/form";
import api from "../api/api";
import http from "../util/http";
import path from "../state/path";
import ui from "../core/ui/util";

class Create extends React.Component {

    static defaultProps = {
        type: '',
        components: [],
        path: {},
        id: 0,
        data: {},
        params: null,
        redirect: 'index',
        redirectBack: false,
        restrictByFk: null,
        attachToRelation: null
    };

    constructor(props) {
        super(props);

        this.state = {
            data: {},
            formErrors: {}
        };

        this.formRef = React.createRef();
    }

    save(data) {

        if (this.props.attachToRelation) {
            data[this.props.attachToRelation] = this.props.path.params.id;
        }

        if (this.props.restrictByFk) {
            data[this.props.restrictByFk] = this.props.path.params.id;
        }

        // Post the data to the backend
        api.execute.post(this.props.path, this.props.id, 'save', data)
            .then(response => {
                // Set the form to ready
                this.formRef.current.ready();
                // Redirect
                this.redirect(response.data);
                // Notify the user
                ui.notify(`${this.props.singular} was created`);

            }, error => {

                let response = error.response;

                // Set the form to ready
                this.formRef.current.ready();
                // Set the error messages
                this.setState({
                    formErrors: response.data.errors
                });
                // Notify the user
                ui.notify(response.data.message);
            });
    }

    redirect(response) {
        path.handleRedirect(this.props, {id: response.data.id});
    }

    render() {
        return (
            <div className="create">
                <Form
                    ref={this.formRef}
                    errors={this.state.formErrors}
                    onSubmit={this.save.bind(this)}
                    submitButtonText={`Create ${this.props.singular}`}
                >
                    {components.renderComponents(this.props.components, this.state.data, this.props.path)}
                </Form>
            </div>
        );
    }
}

export default Create;
