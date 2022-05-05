"use strict";

import React from 'react';
import Thumbnail from "./thumbnail";
import mimetypes from "../../data/mimetypes";
import helpers from "../../util/helpers";

export default class FilePreview extends React.Component {

    static defaultProps = {
        file: {},
        style: [],
        mediaConversion: 'thumb'
    };

    getFileFormat() {

        let map = mimetypes;

        if (! map[this.props.file.mime_type]) {
            return 'unknown';
        }

        return map[this.props.file.mime_type].name;
    }

    getFileColor() {
        let map = mimetypes;
        if (! map[this.props.file.mime_type] || ! map[this.props.file.mime_type].color) {
            return '#ccc';
        }
        return map[this.props.file.mime_type].color;
    }

    render() {

        let content;

        if (this.props.file.is_image) {
            content = <Thumbnail src={this.props.file.conversions[this.props.mediaConversion]} />;
        } else {
            content = (
                <div className="file-preview__textual" style={{'--color': this.getFileColor()}}>
                    <span>{this.getFileFormat()}</span>
                </div>
            );
        }

        return (
            <div className={helpers.className('file-preview', this.props.style)}>
                {content}
            </div>
        );
    }
}
