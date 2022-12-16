"use strict";

import React from 'react';
import Icon from "./icon";

export default class TreeItem extends React.Component {

    static defaultProps = {
        icon: 'folder',
        text: '',
        collapsible: true,
        onOpen: () => {},
        onClose: () => {},
        onToggle: () => {},
        onClick: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.props.onToggle();
        (this.state.isOpen ? this.props.onClose() : this.props.onOpen());
        this.setState({
            isOpen: ! this.state.isOpen
        })
    }

    select() {
        this.props.onClick();
    }

    render() {
        return (
            <div className={'tree-item'+(this.state.isSelected ? ' tree-item--selected' : '')}>
                {this.props.collapsible ?
                    <div className="tree-item__toggle">
                        <Icon name={(this.state.isOpen ? 'expand_more' : 'chevron_right')} onClick={this.toggle.bind(this)} />
                    </div>
                    : null}
                <div className="tree-item__content" onClick={this.select.bind(this)}>
                    <div className="tree-item__icon">
                        <Icon name={this.props.icon} style={'alt'} />
                    </div>
                    <div className="tree-item__text">
                        {this.props.text}
                    </div>
                </div>
            </div>
        );
    }
}
