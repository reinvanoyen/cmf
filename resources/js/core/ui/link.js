import React from 'react';
import helpers from "../../util/helpers";

class Link extends React.Component {

    static defaultProps = {
        'text': '',
        style: 'default',
        onClick: () => {}
    };

    onClick(e) {
        e.stopPropagation();
        if (this.props.onClick) {
            this.props.onClick();
        }
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
