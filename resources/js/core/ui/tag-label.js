import React from 'react';
import color from "../../util/color";
import helpers from "../../util/helpers";

class TagLabel extends React.Component {

    static defaultProps = {
        text: '',
        color: '#cccccc',
        style: ''
    };

    render() {

        let rgb = color.hexToRgb(this.props.color);

        return (
            <span className={helpers.className('tag-label', this.props.style)} style={{backgroundColor: this.props.color, color: color.getContrastColor(rgb[0], rgb[1], rgb[2])}}>
                {this.props.text}
            </span>
        );
    }
}

export default TagLabel;
