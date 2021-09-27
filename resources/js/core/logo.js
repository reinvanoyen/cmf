import React from 'react';

class Logo extends React.Component {

    static defaultProps = {
        name: 'CMF'
    };

    render() {
        return (
            <div className="logo">
                <div className="logo__emblem">{this.props.name[0]}</div>
                <div className="logo__name">
                    {this.props.name}<br />
                    <span>CMF</span>
                </div>
            </div>
        );
    }
}

export default Logo;
