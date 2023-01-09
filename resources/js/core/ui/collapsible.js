"use strict";

import React from 'react';
import IconButton from "./icon-button";

export default class Collapsible extends React.Component {

    static defaultProps = {
        title: '',
        actions: []
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: true
        };
    }

    toggle() {
        this.setState({
            isOpen: ! this.state.isOpen
        })
    }

    renderCollapseButton() {
        if (! this.props.children.length) {
            return;
        }

        return <IconButton name={(this.state.isOpen ? 'remove' : 'add')} iconStyle={'mini'} onClick={this.toggle.bind(this)} />;
    }

    renderContent() {

        if (! this.props.children.length) {
            return;
        }

        return (
            <div className="collapsible__content">
                {this.props.children}
            </div>
        );
    }

    render() {
        return (
            <div className={'collapsible'+(this.state.isOpen ? ' collapsible--open' : ' collapsible--closed')}>
                <div className="collapsible__header">
                    {this.renderCollapseButton()}
                    <div className="collapsible__title">
                        {this.props.title}
                    </div>
                    <div className="collapsible__actions">
                        {this.props.actions}
                    </div>
                </div>
                {this.renderContent()}
            </div>
        );
    }
}
