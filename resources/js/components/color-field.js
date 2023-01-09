import React from 'react';
import Field from "../core/ui/field";
import dom from "../util/dom";
import color from "../util/color";

class ColorField extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        tooltip: '',
        errors: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.data[this.props.name] || ''
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                value: this.props.data[this.props.name] || ''
            });
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        });
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value || '';
    }

    render() {

        let value;
        if (this.state.value) {
            let rgb = color.hexToRgb(this.state.value);
            value = (
                <div className="color-field__color" style={{backgroundColor: this.state.value, color: color.getContrastColor(rgb[0], rgb[1], rgb[2])}}>
                    {this.state.value}
                </div>
            );
        } else {
            value = (
                <div className="color-field__color">
                    Select a color
                </div>
            );
        }

        return (
            <Field
                name={this.props.name}
                label={this.props.label}
                errors={this.props.errors}
                tooltip={this.props.tooltip}
            >
                <div className="color-field">
                    {value}
                    <input
                        id={dom.inputId(this.props.name)}
                        name={this.props.name}
                        className={'color-field__input'}
                        type={'color'}
                        value={this.state.value}
                        disabled={this.props.disabled}
                        onChange={this.handleChange.bind(this)}
                    />
                </div>
            </Field>
        );
    }
}

export default ColorField;
