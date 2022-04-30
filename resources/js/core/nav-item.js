import React from 'react';
import Icon from "./ui/icon";

class NavItem extends React.Component {

    static defaultProps = {
        module: {},
        isActive: false,
        onClick: () => {}
    };

    render() {
        return (
            <div
                className={'nav-item'+(this.props.isActive ? ' nav-item--active' : '')}
                onClick={this.props.onClick}
            >
                <span className="nav-item__icon">
                    <Icon name={this.props.module.icon} />
                </span>
                <span className="nav-item__text">
                    {this.props.module.title}
                </span>
            </div>
        );
    }
}

export default NavItem;
