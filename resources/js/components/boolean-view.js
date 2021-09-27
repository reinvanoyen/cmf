import React from 'react';
import Field from "../core/ui/field";

class BooleanView extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
    };

    render() {

        if (this.props.data && typeof this.props.data[this.props.name] !== 'undefined') {
            return (
                <Field name={this.props.name} label={this.props.label}>
                    <div className={'boolean-view boolean-view--'+(this.props.data[this.props.name] === 1 ? 'checked' : 'unchecked')}>
                        {this.props.data[this.props.name] === 1 ? 'Yes' : 'No'}
                    </div>
                </Field>
            );
        }

        return null;
    }
}

export default BooleanView;
