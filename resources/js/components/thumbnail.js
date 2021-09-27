import React from 'react';
import Field from "../core/ui/field";

export default class Thumbnail extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
    };

    handleSubmit(data) {
        //
    }

    render() {

        let img;

        if (this.props.data[this.props.name]) {
            img = <img src={this.props.data[this.props.name]} />;
        }

        // If there's already an image uploaded
        return (
            <Field name={this.props.name} label={this.props.label}>
                <div className="thumbnail">
                    {img}
                </div>
            </Field>
        );
    }
}
