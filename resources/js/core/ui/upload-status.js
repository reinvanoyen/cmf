"use strict";

import React from 'react';
import Icon from "./icon";

function UploadStatus(props) {

    const icons = {
        queued: 'hourglass_empty',
        uploading: 'arrow_upward'
    };

    return (
        <div className={'upload-status upload-status--'+props.status}>
            <div className="upload-status__icon">
                <Icon name={icons[props.status]} />
            </div>
        </div>
    );
}

UploadStatus.defaultProps = {
    status: ''
};

export default UploadStatus;
