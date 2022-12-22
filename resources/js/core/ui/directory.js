"use strict";

import React from 'react';
import Icon from "./icon";
import i18n from "../../util/i18n";

export default class Directory extends React.Component {

    static defaultProps = {
        directory: {},
        viewMode: 'list',
        actions: [],
        onClick: (e, directory) => {}
    };

    render() {

        let iconStyle = 'default';
        if (this.props.viewMode === 'grid') {
            iconStyle = 'extra-large';
        } else if (this.props.viewMode === 'list') {
            iconStyle = 'large';
        }

        return (
            <div className={'directory directory--'+this.props.viewMode} onClick={e => this.props.onClick(e, this.props.directory)}>
                <div className="directory__icon">
                    <Icon name={'folder'} style={[iconStyle, 'alt']} />
                </div>
                <div className="directory__content">
                    <div className="directory__name">
                        {this.props.directory.name}
                    </div>
                    <div className="directory__type">
                        {i18n.get('snippets.directory')}
                    </div>
                </div>
            </div>
        );
    }
}
