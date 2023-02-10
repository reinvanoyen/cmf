"use strict";

import './index.scss';

import React, { useState } from 'react';
import IconButton from "../icon-button";

function Collapsible(props) {

    const [state, setState] = useState({
        isOpen: true
    });

    const toggle = () => {
        setState({
            ...state,
            isOpen: ! state.isOpen
        });
    }

    const renderCollapseButton = () => {
        if (! props.children.length) {
            return;
        }

        return <IconButton name={(state.isOpen ? 'remove' : 'add')} iconStyle={'mini'} onClick={toggle} />;
    }

    const renderContent = () => {

        if (! props.children.length) {
            return;
        }

        return (
            <div className="collapsible__content">
                {props.children}
            </div>
        );
    }

    return (
        <div className={'collapsible'+(state.isOpen ? ' collapsible--open' : ' collapsible--closed')}>
            <div className="collapsible__header">
                {renderCollapseButton()}
                <div className="collapsible__title">
                    {props.title}
                </div>
                <div className="collapsible__actions">
                    {props.actions}
                </div>
            </div>
            {renderContent()}
        </div>
    );
}

Collapsible.defaultProps = {
    title: '',
    actions: []
};

export default Collapsible;
