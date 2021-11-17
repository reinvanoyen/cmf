import React from 'react';
import icons from "./icons";
import Icon from "./icon";

class Placeholder extends React.Component {

    static defaultProps = {
        icon: 'upload_file',
        onClick: () => {}
    };

    onClick(e) {
        this.props.onClick(e);
    }

    render() {
        return (
            <div className={'placeholder'} onClick={this.onClick.bind(this)}>
                <div className="placeholder__icon">
                    <Icon name={this.props.icon} style={'placeholder'} />
                </div>
                <div className="placeholder__text">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Placeholder;
