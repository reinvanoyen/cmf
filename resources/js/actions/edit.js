import React from 'react';
import components from "../rendering/components";
import Form from "../core/ui/form";
import api from "../api/api";
import path from "../state/path";
import ui from "../core/ui/util";
import i18n from "../util/i18n";
import str from "../util/str";

class Edit extends React.Component {

    static defaultProps = {
        type: '',
        components: [],
        sidebar: [],
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

        this.state = {
            isLoading: true,
            data: {},
            formErrors: {}
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
                data: response.data.data,
                isLoading: false
            });
        });
    }

    save(data) {

        // Add the id to the data first
        data.id = this.props.path.params.id;

        // Post the data to the backend
        api.execute.post(this.props.path, this.props.id,'save', data)
            .then(response => {
                // Ready the form
                this.formRef.current.ready();
                // Redirect
                this.redirect(response.data);
                // Notify the user
                ui.notify(i18n.get('snippets.singular_updated', {singular: this.props.singular}));
            }, error => {

                let response = error.response;

                // Ready the form
                this.formRef.current.ready();

                // Set the error messages
                this.setState({
                    formErrors: response.data.errors
                });
                ui.notify(i18n.get('snippets.form_has_errors'));
            });
    }

    redirect(response) {
        path.handleRedirect(this.props, {id: response.data.id});
    }

    renderContent() {
        return components.renderComponents(this.props.components, this.state.data, this.props.path);
    }

    renderSidebar() {
        return components.renderComponents(this.props.sidebar, this.state.data, this.props.path);
    }

    renderForm() {
        if (this.state.isLoading) {
            return null;
        }

        return (
            <Form
                ref={this.formRef}
                errors={this.state.formErrors}
                onSubmit={this.save.bind(this)}
                submitButtonText={str.toUpperCaseFirst(i18n.get('snippets.save_singular', {singular: this.props.singular}))}
                sidebar={this.renderSidebar()}
            >
                {this.renderContent()}
            </Form>
        );
    }

    render() {
        return (
            <div className={'edit'+(this.state.isLoading ? ' edit--loading' : '')}>
                {this.renderForm()}
            </div>
        );
    }
}

export default Edit;
