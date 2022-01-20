import React from 'react';

class Label extends React.Component {

    static defaultProps = {
        text: '',
        color: '#cccccc'
    };

    render() {
        return (
            <span className="label">
                what
            </span>
        );
    }
}

export default Label;
