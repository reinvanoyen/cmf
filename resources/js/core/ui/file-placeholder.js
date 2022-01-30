"use strict";

import React from 'react';
import fileUtil from "../../util/file";
import UploadStatus from "./upload-status";

export default class FilePlaceholder extends React.Component {

    static defaultProps = {
        data: {}
    };

    render() {
        return (
            <div className={'file-placeholder'}>
                <div className="file-placeholder__status">
                    <UploadStatus status={this.props.data.status} />
                </div>
                <div className="file-placeholder__content">
                    <div className="file-placeholder__name">
                        {this.props.data.name}
                    </div>
                    <div className="file-placeholder__size">
                        {fileUtil.filesize(this.props.data.size)}
                    </div>
                    <div className="file-placeholder__progress">
                        <progress className={'file-placeholder__progress-bar'} max={100} value={this.props.data.progress} />
                    </div>
                </div>
            </div>
        );
    }
}
