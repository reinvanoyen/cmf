import React from 'react';

class Overlay extends React.Component {

    render() {
        return (
            <>
                <div className="overlay"></div>
                {this.props.children}
            </>
        );
    }
}

export default Overlay;
