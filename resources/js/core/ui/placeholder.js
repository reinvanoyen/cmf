import React from 'react';
import icons from "./icons";

class Placeholder extends React.Component {

    static defaultProps = {
        icon: 'imageUpload',
        onClick: () => {}
    };

    onClick(e) {
        this.props.onClick(e);
    }

    render() {
        return (
            <div className={'placeholder'} onClick={this.onClick.bind(this)}>
                <div className="placeholder__icon">
                    {icons[this.props.icon]}
                </div>
                <div className="placeholder__text">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Placeholder;
