import React from 'react';
import dom from "../../util/dom";
import Tooltip from "./tooltip";

class Field extends React.Component {

    static defaultProps = {
        name: '',
        label: '',
        required: false,
        errors: {},
        tooltip: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            id: dom.inputId(this.props.name)
        };
    }

    render() {

        let label;
        let error;
        let requiredIndicator;
        let tooltip;

        if (this.props.showRequiredIndicator) {
            requiredIndicator = <span className="field__required-indicator">*</span>;
        }

        if (this.props.label) {
            label = (
                <label htmlFor={this.state.id} className="label label--primary field__label">
                    {this.props.label}
                    {requiredIndicator}
                </label>
            );
        }

        if (this.props.tooltip) {
            tooltip = <div className="field__tooltip"><Tooltip text={this.props.tooltip} /></div>;
        }

        if (this.props.errors[this.props.name]) {
            error = (
                <span className="field__error">
                    {this.props.errors[this.props.name]}
                </span>
            );
        }

        return (
            <div className="field">
                {label || tooltip ? <div className="field__header">{label} {tooltip}</div> : null}
                <div className="field__input">
                    {this.props.children}
                </div>
                {error}
            </div>
        );
    }
}

export default Field;
