import React from 'react';
import actions from "../../rendering/actions";
import components from "../../rendering/components";
import Title from "../ui/title";

function Module(props) {

    const renderHeader = () => {

        const header = props.action.header || [];
        const headerComponents = header.map((component, i) => {
            return (
                <div className={'module__header-component'} key={i}>
                    {components.renderComponent(component, {}, props.path)}
                </div>
            );
        });

        return (
            <div className="module__header">
                <div className="module__title">
                    <Title>{props.action.title || props.title}</Title>
                </div>
                <div className={'module__header-components'}>
                    {headerComponents}
                </div>
            </div>
        );
    }

    return (
        <div className="module">
            {renderHeader()}
            <div className="module__main">
                {actions.renderAction(props.action, {}, props.path)}
            </div>
        </div>
    );
}

Module.defaultProps = {
    path: {},
    action: {}
};

export default Module;
