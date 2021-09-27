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
        restrictByFk: null
    };

    constructor(props) {
        super(props);

        this.state = {
            data: {}
        };

        this.formRef = React.createRef();
    }

    save(data) {

        if (this.props.restrictByFk) {
            data[this.props.restrictByFk] = this.props.path.params.id;
        }

        // Post the data to the backend
        api.execute.post(this.props.path, this.props.id, 'save', http.formData(data))
            .then(response => {

                this.formRef.current.ready();

                this.redirect(response);

                // Notify the user
                ui.notify('Item was created');

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
            <div className="create">
                <Form
                    ref={this.formRef}
                    onSubmit={this.save.bind(this)}
                    submitButtonText={'Create'}
                >
                    {componentList}
                </Form>
            </div>
        );
    }
}

export default Create;
