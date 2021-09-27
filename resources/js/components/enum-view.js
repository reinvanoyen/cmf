import React from 'react';

class EnumView extends React.Component {

    static defaultProps = {
        data: {},
        label: '',
        name: '',
        options: {}
    };

    render() {
        if (this.props.data && typeof this.props.data[this.props.name] !== 'undefined') {
            return (
                <div className={'enum-view enum-view--'+this.props.style}>
                    {this.props.options[this.props.data[this.props.name]]}
                </div>
            );
        }

        return null;
    }
}

export default EnumView;
