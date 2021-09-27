import React from 'react';
import Title from "./title";

class Window extends React.Component {

    static defaultProps = {
        title: ''
    };

    render() {
        return (
            <div className="window">
                <div className="window__header">
                    <Title>{this.props.title}</Title>
                </div>
                <div className="window__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Window;
