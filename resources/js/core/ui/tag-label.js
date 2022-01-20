import React from 'react';
import color from "../../util/color";

class TagLabel extends React.Component {

    static defaultProps = {
        text: '',
        color: '#cccccc'
    };

    render() {

        let rgb = color.hexToRgb(this.props.color);

        return (
            <span className="tag-label" style={{backgroundColor: this.props.color, color: color.getContrastColor(rgb[0], rgb[1], rgb[2])}}>
                {this.props.text}
            </span>
        );
    }
}

export default TagLabel;
