import './index.scss';

import React from 'react';
import meta from "../../util/meta";

class FooterText extends React.Component {

    getVersion() {
        return meta.get('cmf:version');
    }

    render() {
        return (
            <div className={'footer-text'}>
                &copy; {this.props.title || ''} – <a href="https://github.com/reinvanoyen/cmf" title="CMF on Github" target="_blank">CMF {this.getVersion()}</a> – Built with love by <a href="https://www.reinvanoyen.be" title="Rein Van Oyen" target="_blank">Rein Van Oyen</a>
            </div>
        );
    }
}

export default FooterText;
