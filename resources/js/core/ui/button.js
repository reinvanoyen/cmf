import React from 'react';
import helpers from '../../util/helpers';
import Icon from "./icon";

class Button extends React.Component {

    static defaultProps = {
        'text': '',
        'type': 'button',
        'style': 'default',
        'icon': '',
        onClick: () => {}
    };

    onClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {

        let icon;

        if (this.props.icon) {
            icon = (
                <span className="button__icon">
                    <Icon style={'mini'} name={this.props.icon} />
                </span>
            );
        }

        return (
            <button className={helpers.className('button', this.props.style)+' button--has-icon'} onClick={e => this.onClick(e)} type={this.props.type}>
                {icon}
                {this.props.text}
            </button>
        );
    }
}

export default Button;
