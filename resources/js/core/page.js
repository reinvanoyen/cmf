import React from 'react';
import Logo from "./logo";
import i18n from "../util/i18n";
import FooterText from "./footer-text";

function Page(props) {
    return (
        <div className="page">
            <div className="page__visual">
                <div className="hero">
                    {i18n.get('snippets.baseline')}
                </div>
            </div>
            <div className="page__content">
                <div className="page__logo">
                    <Logo name={props.title} />
                </div>
                <div className="page__box">
                    {props.children}
                </div>
                <div className="page__footer">
                    <FooterText />
                </div>
            </div>
        </div>
    );
}

Page.defaultProps = {
    title: 'CMF'
};

export default Page;
