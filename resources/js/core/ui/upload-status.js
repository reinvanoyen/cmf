"use strict";

import React from 'react';
import Icon from "./icon";

export default class UploadStatus extends React.Component {

    static defaultProps = {
        status: ''
    };

    getIcon() {
        let map = {
            queued: 'hourglass_empty',
            uploading: 'arrow_upward'
        };

        return map[this.props.status];
    }

    render() {
        return (
            <div className={'upload-status upload-status--'+this.props.status}>
                <div className="upload-status__icon">
                    <Icon name={this.getIcon()} />
                </div>
            </div>
        );
    }
}
