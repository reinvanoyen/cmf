import React from 'react';
import helpers from "../../util/helpers";

class Link extends React.Component {

    static defaultProps = {
        'text': '',
        onClick: () => {},
        style: 'default'
    };

    onClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {
        return (
            <button className={helpers.className('link', this.props.style)} onClick={e => this.onClick(e)} type="button">
                {this.props.text}
            </button>
        );
    }
}

export default Link;
