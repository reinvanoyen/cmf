import React from 'react';
import Field from "../core/ui/field";

class ColorView extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
    };

    render() {

        let style = {};
        if (this.props.data && typeof this.props.data[this.props.name] !== 'undefined') {
            style.backgroundColor = this.props.data[this.props.name];
        }

        return (
            <Field
                name={this.props.name}
                label={this.props.label}
            >
                <div className={'color-view'} style={style}></div>
            </Field>
        );
    }
}

export default ColorView;
