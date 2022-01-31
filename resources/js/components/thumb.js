import React from 'react';
import Field from "../core/ui/field";
import Thumbnail from "../core/ui/thumbnail";

export default class Thumb extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
    };

    handleSubmit(data) {
        //
    }

    render() {

        let thumb;

        if (this.props.data[this.props.name]) {
            thumb = <Thumbnail src={this.props.data[this.props.name].conversions.thumb} />
        }

        // If there's already an image uploaded
        return (
            <Field name={this.props.name} label={this.props.label}>
                <div className="thumb-component">
                    {thumb}
                </div>
            </Field>
        );
    }
}
