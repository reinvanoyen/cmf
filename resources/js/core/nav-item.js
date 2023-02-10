import React from "react";
import Icon from "./ui/icon";

function NavItem(props) {
    return (
        <div
            className={'nav-item'+(props.isActive ? ' nav-item--active' : '')}
            onClick={props.onClick}
        >
            <span className="nav-item__icon">
                <Icon name={props.module.icon} />
            </span>
            <span className="nav-item__text">
                {props.module.title}
            </span>
        </div>
    );
}

NavItem.defaultProps = {
    module: {},
    isActive: false,
    onClick: () => {}
};

export default NavItem;
