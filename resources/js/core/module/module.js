import React from 'react';
import actions from "../../rendering/actions";
import components from "../../rendering/components";
import Title from "../ui/title";

class Module extends React.Component {

    static defaultProps = {
        path: {},
        action: {}
    };

    renderHeader() {

        let headerComponents = [];

        if (this.props.action.header) {
            this.props.action.header.forEach((component, i) => {
                headerComponents.push(
                    <div className={'module__header-component'} key={i}>
                        {components.renderComponent(component, {}, this.props.path)}
                    </div>
                );
            });
        }

        return (
            <div className="module__header">
                <div className="module__title">
                    <Title>{this.props.action.title || this.props.title}</Title>
                </div>
                <div className={'module__header-components'}>
                    {headerComponents}
                </div>
            </div>
        );
    }

    render() {

        return (
            <div className="module">
                {this.renderHeader()}
                <div className="module__main">
                    {actions.renderAction(this.props.action, {}, this.props.path)}
                </div>
            </div>
        );
    }
}

export default Module;
