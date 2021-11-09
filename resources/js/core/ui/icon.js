import React from 'react';

class Icon extends React.Component {

    static defaultProps = {
        'text': '',
        'type': 'icon',
        'style': 'default',
        'name': 'fingerprint',
        onClick: null
    };

    onClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {
        return (
            <span className={'icon icon--'+this.props.style} onClick={this.props.onClick ? this.onClick.bind(this) : null}>
                {this.props.name}
            </span>
        );
    }
}

export default Icon;
