import React from 'react';
import Field from "../core/ui/field";

export default class ImageView extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
    };

    handleSubmit(data) {
        //
    }

    render() {
        if (this.props.data[this.props.name]) {
            // If there's already an image uploaded
            return (
                <Field name={this.props.name} label={this.props.label}>
                    <div className="image-view">
                        <img src={this.props.data[this.props.name]} />
                    </div>
                </Field>
            );
        }

        return null;
    }
}
