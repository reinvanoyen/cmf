import React from 'react';
import Icon from "./icon";
import Button from "./button";

class Placeholder extends React.Component {

    static defaultProps = {
        icon: 'upload_file',
        button: '',
        onClick: null
    };

    render() {
        return (
            <div className={'placeholder'+(this.props.onClick ? ' placeholder--clickable' : '')} onClick={this.props.onClick}>
                <div className="placeholder__icon">
                    <Icon name={this.props.icon} style={'placeholder'} />
                </div>
                <div className="placeholder__text">
                    {this.props.children}
                </div>
                {this.props.button ?
                <div className="placeholder__button">
                    <Button text={this.props.button} style={['secondary', 'small']} icon={this.props.icon} onClick={this.props.onClick} />
                </div> : null}
            </div>
        );
    }
}

export default Placeholder;
