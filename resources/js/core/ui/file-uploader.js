"use strict";

import React from 'react';
import Placeholder from "./placeholder";
import upload from "../../util/upload";

export default class FileUploader extends React.Component {

    static defaultProps = {
        directory: null,
        onUploadDone: () => {}
    };

    handleChange(e) {
        let files = e.target.files;

        for (let i = 0; i < files.length; i++) {
            this.upload(files[i]);
        }
    }

    upload(file) {
        upload.queue(file, this.props.directory, file => {
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
