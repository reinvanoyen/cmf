import React from "react";

const Logo = (props) => {
    return (
        <div className="logo">
            <div className="logo__emblem">{props.name[0]}</div>
            <div className="logo__name">
                {props.name}<br />
                <span>{props.subtitle}</span>
            </div>
        </div>
    );
}

Logo.defaultProps = {
    name: 'CMF',
    subtitle: 'CMF'
};

export default Logo;
