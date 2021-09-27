import React from 'react';
import Logo from "./logo";

class Page extends React.Component {

    static defaultProps = {
        title: 'CMF'
    };

    render() {
        return (
            <div className="page">
                <div className="page__visual">
                    <div className="hero">
                        The Solid Foundation For Your Content.
                    </div>
                </div>
                <div className="page__content">
                    <div className="page__logo">
                        <Logo name={this.props.title} />
                    </div>
                    <div className="page__box">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;
