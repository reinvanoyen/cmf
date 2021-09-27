import React from 'react';
import components from "../rendering/components";
import api from "../api/api";
import http from "../util/http";
import path from "../state/path";
import ui from "../core/ui/util";
import Button from "../core/ui/button";
import Link from "../core/ui/link";

class CreateWizard extends React.Component {

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
        steps: {}
    };

    constructor(props) {
        super(props);

        this.componentLists = [];

        this.state = {
            currentStepIndex: 0
        };
    }

    save(data) {

        if (this.props.restrictByFk) {
            data[this.props.restrictByFk] = this.props.path.params.id;
        }

        // Post the data to the backend
        api.execute.post(this.props.path, this.props.id, 'save', http.formData(data))
            .then(response => {

                this.redirect(response);

                // Notify the user
                ui.notify('Item was created');

            }, error => {

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

    renderWizard() {

        let steps = this.props.steps.map((step, i) => {
            return (
                <li className={'wizard__step'+(i <= this.state.currentStepIndex ? ' wizard__step--active' : '')} key={i} onClick={e => this.goTo(i)}>
                    <span>{i+1}</span>
                    {step.title}
                </li>
            );
        });

        return (
            <div className="wizard">
                <div className="wizard__nav">
                    <ul className="wizard__steps">
                        {steps}
                    </ul>
                </div>
                <div className="wizard__content">
                    {this.renderWizardContent()}
                </div>
                <div className="wizard__footer">
                    {this.renderWizardFooter()}
                </div>
            </div>
        );
    }

    renderWizardFooter() {
        return [
            (this.state.currentStepIndex > 0 ? <div className="wizard__footer-component"><Link onClick={this.goToPrev.bind(this)} text={'Previous'} /></div> : null),
            <div className="wizard__footer-component"><Button style={'large'} onClick={this.goToNext.bind(this)} text={this.isLastStep() ? 'Create' : 'Next'} /></div>
        ];
    }

    renderWizardContent() {
        return this.props.steps.map((step, i) => {
            return (
                <div className="wizard__step-content" key={i} style={{display: (i === this.state.currentStepIndex ? 'block' : 'none')}}>
                    {this.componentLists[i].map(obj => obj.component)}
                </div>
            );
        });
    }

    isLastStep() {
        return (this.state.currentStepIndex === this.props.steps.length - 1);
    }

    goTo(index) {
        if (index < this.state.currentStepIndex || index === (this.state.currentStepIndex + 1)) {
            this.setState({
                currentStepIndex: index
            });
        }
    }

    goToNext() {

        if (this.state.currentStepIndex === this.props.steps.length - 1) {

            let data = {};

            this.componentLists.forEach(list => {
                list.forEach(obj => {
                    obj.ref.current.handleSubmit(data);
                });
            });

            this.save(data);
            return;
        }

        this.goTo(this.state.currentStepIndex + 1);
    }

    goToPrev() {
        this.goTo(this.state.currentStepIndex - 1);
    }

    render() {

        this.componentLists = this.props.steps.map((step, i) => {
            return components.renderComponentsWith(step.components, this.props.data, this.props.path, (component, i) => {
                return (
                    <div className="wizard__component" key={i}>
                        {component}
                    </div>
                );
            }, true);
        });

        return (
            <div className="create-wizard">
                <div className="create-wizard__wizard">
                    {this.renderWizard()}
                </div>
            </div>
        );
    }
}

export default CreateWizard;
