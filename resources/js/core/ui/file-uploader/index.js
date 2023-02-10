"use strict";

import './index.scss';

import React from 'react';
import Placeholder from "../placeholder";
import uploadUtil from "../../../util/upload";
import i18n from "../../../util/i18n";

function FileUploader(props) {

    const handleChange = (e) => {
        upload(e.target.files);
    }

    const upload = (files) => {
        uploadUtil.queueMultiple(files, props.directory, file => {
            props.onFileUploaded(file);
            if (uploadUtil.isDone()) {
                props.onUploadDone();
            }
        });
    }

    return (
        <div className="file-uploader">
            <div className="file-uploader__input">
                <input type={'file'} name={'file-uploader'} multiple={true} onChange={handleChange.bind(this)} />
            </div>
            <div className="file-uploader__placeholder">
                <Placeholder>{i18n.get('snippets.select_files_from_computer')}</Placeholder>
            </div>
        </div>
    );
}

FileUploader.defaultProps = {
    directory: null,
    onUploadDone: () => {},
    onFileUploaded: file => {}
};

export default FileUploader;
