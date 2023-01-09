import TextField from "./text-field";
import React from 'react';
import dom from "../util/dom";
import helpers from "../util/helpers";
import Field from "../core/ui/field";

export default class NumberField extends TextField {

    static defaultProps = {
        htmlType: 'number',
        min: null,
        max: null,
        step: null
    };

    render() {

        return (
            <Field
                name={this.props.name}
                required={this.props.showRequiredIndicator}
                label={this.props.label}
                errors={this.props.errors}
                tooltip={this.props.tooltip}
            >
                <input
                    id={dom.inputId(this.props.name)}
                    name={this.props.name}
                    className={helpers.className('number-field', this.props.style)}
                    type={this.props.htmlType}
                    value={this.state.value || ''}
                    disabled={this.props.disabled}
                    placeholder={this.props.placeholder}
                    step={this.props.step !== null ? this.props.step : null}
                    min={this.props.min !== null ? this.props.min : null}
                    max={this.props.max !== null ? this.props.max : null}
                    onChange={this.handleChange.bind(this)}
                    onKeyUp={this.handleChange.bind(this)}
                    autoComplete={'off'}
                />
            </Field>
        );
    }
}
