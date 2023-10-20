import React from 'react';
import helpers from "../../util/helpers";

class Icon extends React.Component {

    static defaultProps = {
        'text': '',
        'type': 'icon',
        'style': [],
        'name': 'fingerprint',
        onClick: null
    };

    onClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {

        if (this.props.onClick !== null) {
            this.props.style.push('clickable');
        }

        return (
            <span className={helpers.className('icon', this.props.style)} onClick={this.props.onClick ? this.onClick.bind(this) : null}>
                {this.props.name}
            </span>
        );
    }
}

export default Icon;
