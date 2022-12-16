import React from 'react';

class Overlay extends React.Component {

    render() {
        return (
            <React.Fragment>
                <div className="overlay"></div>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default Overlay;
