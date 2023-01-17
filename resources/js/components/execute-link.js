import React from 'react';
import Button from "../core/ui/button";
import UiLink from "../core/ui/link";
import api from "../api/api";
import util from "../core/ui/util";
import path from "../state/path";
import Overlay from "../core/ui/overlay";
import Window from "../core/ui/window";
import Form from "../core/ui/form";
import components from "../rendering/components";
import ReactDOM from "react-dom";

class ExecuteLink extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        action: '',
        components: [],
        notification: 'Success'
    };

    constructor(props) {
        super(props);

        this.state = {
            formErrors: {},
            isOpen: false
        };

        this.widgetMountEl = null;
        this.formRef = React.createRef();
    }

    close() {
        this.widgetMountEl.remove();
    }

    open() {
        this.widgetMountEl = document.body.appendChild(document.createElement('div'));
        ReactDOM.render(this.renderAskWidget(), this.widgetMountEl);
    }

    redirect(response) {
        path.handleRedirect(this.props, {id: response.data.id});
    }

    handleClick() {
        if (this.props.components.length) {
            this.open();
            return;
        }

        this.execute();
    }

    execute(data) {

        this.close();

        // Add the id to the data first
        data.id = this.props.data.id || null;

        let path = { ...this.props.path, action: this.props.action };

        // Load the data from the backend (with id as param)
        api.modules.post(path,'handle', data).then(response => {
            util.notify(this.props.notification);
            this.redirect(response.data);
        });
    }

    renderAskComponents() {
        return components.renderComponents(this.props.components, {}, this.props.path);
    }

    renderAskWidget() {
         return (
            <Overlay>
                <Window title={this.props.text} style={'modal'} closeable={true} onClose={this.close.bind(this)}>
                    <Form
                        ref={this.formRef}
                        errors={this.state.formErrors}
                        realForm={false}
                        onSubmit={this.execute.bind(this)}
                        submitButtonText={'Submit'}
                    >
                        {this.renderAskComponents()}
                    </Form>
                </Window>
            </Overlay>
        );
    }

    renderLink() {
        if (this.props.style) {
            return (
                <Button style={this.props.style} text={this.props.text} onClick={this.handleClick.bind(this)} />
            );
        }
        return <UiLink onClick={this.handleClick.bind(this)} text={this.props.text} />;
    }

    render() {
        if (this.props.style) {
            return (
                <Button style={this.props.style} text={this.props.text} onClick={this.handleClick.bind(this)} />
            );
        }

        return <UiLink onClick={this.handleClick.bind(this)} text={this.props.text} />;
    }
}

export default ExecuteLink;
