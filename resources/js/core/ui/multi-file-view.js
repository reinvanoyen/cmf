"use strict";

import React from 'react';
import helpers from "../../util/helpers";
import Title from "./title";
import Button from "./button";
import File from "./file";
import util from "./util";

export default class MultiFileView extends React.Component {

    static defaultProps = {
        files: [],
        style: [],
        onDeleteFiles: () => {},
        onChangeFilesProperty: (property, value) => {}
    };

    deleteFiles() {
        this.props.onDeleteFiles();
    }

    openPropertyEditPrompt(property, value) {

        let propertyLc = property.toLowerCase();

        util.prompt({
            title: 'Update '+propertyLc+' of '+this.props.files.length+' files',
            text: 'Careful! The current '+propertyLc+' of '+this.props.files.length+' files will be overwritten with this new '+propertyLc+'.',
            defaultValue: value,
            confirm: newValue => this.props.onChangeFilesProperty(property, newValue),
            confirmButtonText: 'Save'
        });
    }

    render() {
        return (
            <div className={helpers.className('multi-file-view', this.props.style)}>
                <div className="multi-file-view__header">
                    <Title style={['small']}>{this.props.files.length} files selected</Title>
                </div>
                <div className="multi-file-view__actions">
                    <Button
                        text={'Update description'}
                        style={['small', 'secondary', 'full']}
                        onClick={e => this.openPropertyEditPrompt('Description', '')}
                    />
                    <Button
                        text={'Update copyright'}
                        style={['small', 'secondary', 'full']}
                        onClick={e => this.openPropertyEditPrompt('Copyright', '')}
                    />
                </div>
                <div className="multi-file-view__content">
                    {this.props.files.map((file, i) => {
                        return (
                            <File file={file} key={i} />
                        );
                    })}
                </div>
                <div className="multi-file-view__footer">
                    <Button text={'Delete '+this.props.files.length+' files'} style={['full']} onClick={this.deleteFiles.bind(this)} />
                </div>
            </div>
        );
    }
}
