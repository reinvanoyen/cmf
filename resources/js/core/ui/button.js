import React from 'react';
import helpers from '../../util/helpers';

class Button extends React.Component {

    static defaultProps = {
        'text': '',
        'type': 'button',
        'style': 'default',
        onClick: () => {}
    };

    onClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }

    render() {
        return (
            <button className={helpers.className('button', this.props.style)} onClick={e => this.onClick(e)} type={this.props.type}>
                {this.props.text}
            </button>
        );
    }
}

export default Button;
