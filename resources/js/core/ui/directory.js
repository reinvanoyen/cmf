"use strict";

import React from 'react';
import Icon from "./icon";
import i18n from "../../util/i18n";
import { useSelector } from "react-redux";

function Directory(props) {

    const { viewMode } = useSelector(state => state.media);

    const render = () => {

        let iconStyle = 'default';
        if (viewMode === 'grid') {
            iconStyle = 'extra-large';
        } else if (viewMode === 'list') {
            iconStyle = 'large';
        }

        return (
            <div className={'directory directory--'+viewMode} onClick={e => props.onClick(e, props.directory)}>
                <div className="directory__icon">
                    <Icon name={'folder'} style={[iconStyle, 'alt']} />
                </div>
                <div className="directory__content">
                    <div className="directory__name">
                        {props.directory.name}
                    </div>
                    <div className="directory__type">
                        {i18n.get('snippets.directory')}
                    </div>
                </div>
            </div>
        );
    }

    return render();
}

Directory.defaultProps = {
    directory: {},
    actions: [],
    onClick: (e, directory) => {}
};

export default Directory;
