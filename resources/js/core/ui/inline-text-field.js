import React from 'react';

class InlineTextField extends React.Component {

    static defaultProps = {
        value: '',
        onChange: () => {}
    };

    render() {
        return (
            <div>
                <input type={'text'} value={this.props.value} />
                <span>{this.props.value}</span>
            </div>
        );
    }
}

export default InlineTextField;
