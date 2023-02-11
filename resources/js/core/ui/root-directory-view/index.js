"use strict";

import './index.scss';

import React from 'react';
import helpers from "../../../util/helpers";
import Title from "../title";
import i18n from "../../../util/i18n";

function RootDirectoryView(props) {
    return (
        <div className={helpers.className('directory-view', props.style)}>
            <div className="directory-view__header">
                <Title style={['small']}>{i18n.get('snippets.files_root')}</Title>
                {i18n.get('snippets.directory')}
            </div>
        </div>
    );
}

export default RootDirectoryView;
