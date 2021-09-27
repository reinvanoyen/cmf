import React from 'react';
import Field from "../core/ui/field";

class BelongsToView extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: ''
    };

    render() {
        if (this.props.data && typeof this.props.data[this.props.name] !== 'undefined') {
            return (
                <div className={'belongs-to-view'}>
                    {this.props.data[this.props.name]}
                </div>
            );
        }

        return null;
    }
}

export default BelongsToView;
