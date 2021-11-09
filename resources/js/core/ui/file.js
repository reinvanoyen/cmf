"use strict";

import React from 'react';
import FilePreview from "./file-preview";
import fileUtil from "../../util/file";

export default class File extends React.Component {

    static defaultProps = {
        file: {},
        isSelected: false,
        onClick: (e, file) => {}
    };

    render() {
        return (
            <div className={'file'+(this.props.isSelected ? ' file--selected' : '')} onClick={e => this.props.onClick(e, this.props.file)}>
                <div className="file__preview">
                    <FilePreview file={this.props.file} />
                </div>
                <div className="file__name">
                    {this.props.file.name}
                </div>
                <div className="file__size">
                    {fileUtil.filesize(this.props.file.size)}
                </div>
                <div className="file__disk">
                    {this.props.file.disk}
                </div>
            </div>
        );
    }
}
