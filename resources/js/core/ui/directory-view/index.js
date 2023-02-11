"use strict";

import './index.scss';

import React from 'react';
import helpers from "../../../util/helpers";
import Title from "../title";
import DefinitionList from "../definition-list";
import i18n from "../../../util/i18n";

function DirectoryView(props) {
    return (
        <div className={helpers.className('directory-view', props.style)}>
            <div className="directory-view__header">
                <Title style={['small']}>{props.directory.name}</Title>
                {i18n.get('snippets.directory')}
            </div>
            <div className="directory-view__content">
                <DefinitionList
                    data={[
                        ['created', props.directory.created_at],
                    ]}
                />
            </div>
        </div>
    );
}

DirectoryView.defaultProps = {
    directory: null
};

export default DirectoryView;
