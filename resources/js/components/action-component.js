import React from 'react';
import actions from "../rendering/actions";
import components from "../rendering/components";
import Title from "../core/ui/title";

export default class ActionComponent extends React.Component {

    static defaultProps = {
        data: {},
        action: {},
        path: {},
        title: ''
    };

    handleSubmit(data) {
        //
    }

    renderHeaderComponents() {
        if (this.props.action.header) {
            return this.props.action.header.map((component, i) => {
                return (
                    <div className={'action-component__header-component'} key={i}>
                        {components.renderComponent(component, {}, this.props.path)}
                    </div>
                );
            });
        }

        return null;
    }

    renderHeader() {
        if (this.props.title || this.props.action.title || this.props.action.header) {
            return (
                <div className="action-component__header">
                    <div className="action-component__title">
                        <Title style={'small'}>{this.props.title || this.props.action.title}</Title>
                    </div>
                    <div className="action-component__header-components">
                        {this.renderHeaderComponents()}
                    </div>
                </div>
            );
        }

        return null;
    }

    render() {
        return (
            <div className="action-component">
                {this.renderHeader()}
                <div className="action-component__content">
                    {actions.renderAction(this.props.action, this.props.data, this.props.path)}
                </div>
            </div>
        );
    }
}
