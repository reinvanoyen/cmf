"use strict";

import React from 'react';
import Placeholder from "./placeholder";
import upload from "../../util/upload";

export default class FileUploader extends React.Component {

    static defaultProps = {
        directory: null,
        onUploadDone: () => {},
        onFileUploaded: file => {}
    };

    handleChange(e) {
        this.upload(e.target.files);
    }

    upload(files) {
        upload.queueMultiple(files, this.props.directory, file => {
            this.props.onFileUploaded(file);
            if (upload.isDone()) {
                this.props.onUploadDone();
            }
        });
    }

    render() {
        return (
            <div className="file-uploader">
                <div className="file-uploader__input">
                    <input type={'file'} name={'file-uploader'} multiple={true} onChange={this.handleChange.bind(this)} />
                </div>
                <div className="file-uploader__placeholder">
                    <Placeholder>Select your file(s)</Placeholder>
                </div>
            </div>
        );
    }
}
