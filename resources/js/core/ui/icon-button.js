import React from 'react';
import helpers from '../../util/helpers';
import Icon from "./icon";

class IconButton extends React.Component {

    static defaultProps = {
        name: 'fingerprint',
        style: '',
        iconStyle: 'default',
        onClick: e => {}
    };

    onClick(e) {
        e.stopPropagation();
        this.props.onClick(e);
    }

    render() {
        return (
            <button className={helpers.className('icon-button', this.props.style)} onClick={this.onClick.bind(this)} type={'button'}>
                <Icon
                    name={this.props.name}
                    style={this.props.iconStyle}
                />
            </button>
        );
    }
}

export default IconButton;
