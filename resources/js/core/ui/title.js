import React from 'react';
import helpers from "../../util/helpers";

class Title extends React.Component {

    static defaultProps = {
        style: 'default'
    };

    render() {
        return (
            <h1 className={helpers.className('title', this.props.style)}>
                {this.props.children}
            </h1>
        );
    }
}

export default Title;
