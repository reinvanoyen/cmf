import React from 'react';
import Icon from "./ui/icon";

class SubnavItem extends React.Component {

    static defaultProps = {
        module: {},
        isActive: false,
        onClick: () => {}
    };

    render() {
        return (
            <div
                className={'subnav-item'+(this.props.isActive ? ' subnav-item--active' : '')}
                onClick={this.props.onClick}
            >
                <span className="subnav-item__icon">
                    <Icon name={this.props.module.icon} />
                </span>
                <span className="subnav-item__text">
                    {this.props.module.title}
                </span>
            </div>
        );
    }
}

export default SubnavItem;
