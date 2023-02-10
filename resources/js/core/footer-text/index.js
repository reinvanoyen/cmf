import './index.scss';

import React from 'react';
import { useSelector } from "react-redux";

function FooterText() {

    const { title, version } = useSelector(state => state.cmf);

    return (
        <div className={'footer-text'}>
            &copy; {title || ''} – <a href="https://github.com/reinvanoyen/cmf" title="CMF on Github" target="_blank">CMF {version}</a> – Built with love by <a href="https://www.reinvanoyen.be" title="Rein Van Oyen" target="_blank">Rein Van Oyen</a>
        </div>
    );
}

export default FooterText;
