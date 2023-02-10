import React from 'react';
import Icon from "./ui/icon";

function SubnavItem(props) {
    return (
        <div
            className={'subnav-item'+(props.isActive ? ' subnav-item--active' : '')}
            onClick={props.onClick}
        >
            <span className="subnav-item__icon">
                <Icon name={props.module.icon} />
            </span>
            <span className="subnav-item__text">
                {props.module.title}
            </span>
        </div>
    );
}

SubnavItem.defaultProps = {
    module: {},
    isActive: false,
    onClick: () => {}
};

export default SubnavItem;
