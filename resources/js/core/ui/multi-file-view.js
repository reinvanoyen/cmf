"use strict";

import React from 'react';
import helpers from "../../util/helpers";
import Title from "./title";
import Button from "./button";
import File from "./file";

export default class MultiFileView extends React.Component {

    static defaultProps = {
        files: [],
        style: [],
        onDeleteFiles: () => {}
    };

    deleteFiles() {
        this.props.onDeleteFiles();
    }

    render() {
        return (
            <div className={helpers.className('multi-file-view', this.props.style)}>
                <div className="multi-file-view__header">
                    <Title style={['small']}>{this.props.files.length} files selected</Title>
                </div>
                <div className="multi-file-view__content">
                    {this.props.files.map((file, i) => {
                        return (
                            <File file={file} key={i} />
                        );
                    })}
                </div>
                <div className="file-view__footer">
                    <Button text={'Delete '+this.props.files.length+' files'} style={['full']} onClick={this.deleteFiles.bind(this)} />
                </div>
            </div>
        );
    }
}
