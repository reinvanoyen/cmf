import React from 'react';

class Icon extends React.Component {

    static defaultProps = {
        'text': '',
        'type': 'icon',
        'style': 'default',
        'name': 'fingerprint',
        onClick: () => {}
    };

    onClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {
        return (
            <span className={'icon icon--'+this.props.style} onClick={this.onClick.bind(this)}>
                {this.props.name}
            </span>
        );
    }
}

export default Icon;
