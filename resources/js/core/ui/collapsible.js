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

    render() {
        return (
            <div className={'collapsible'+(this.state.isOpen ? ' collapsible--open' : ' collapsible--closed')}>
                <div className="collapsible__header">
                    <IconButton name={(this.state.isOpen ? 'remove' : 'add')} style={'transparent'} iconStyle={'mini'} onClick={this.toggle.bind(this)} />
                    <div className="collapsible__title">
                        {this.props.title}
                    </div>
                    <div className="collapsible__actions">
                        {this.props.actions}
                    </div>
                </div>
                <div className="collapsible__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
