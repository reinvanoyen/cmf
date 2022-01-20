"use strict";

import React from 'react';
import helpers from "../../util/helpers";
import Title from "./title";
import FilePreview from "./file-preview";
import Button from "./button";
import Select from "./select";
import file from "../../util/file";
import DefinitionList from "./definition-list";
import mimetypes from "../../data/mimetypes";

export default class FileView extends React.Component {

    static defaultProps = {
        file: {},
        fileLabels: {},
        style: [],
        onDeleteFile: () => {},
        onRenameFile: () => {},
        onLabelFile: (label) => {}
    };

    deleteFile() {
        this.props.onDeleteFile();
    }

    renameFile() {
        this.props.onRenameFile();
    }

    downloadFile() {
        window.open(this.props.file.url);
    }

    getFileDescription() {
        if (mimetypes[this.props.file.mime_type] && mimetypes[this.props.file.mime_type].description) {
            return mimetypes[this.props.file.mime_type].description;
        }

        return 'Unknown filetype';
    }

    handleLabelFile(value) {
        this.props.onLabelFile(value);
    }

    renderLabelSelect() {
        if (Object.keys(this.props.fileLabels).length) {

            let options = {};
            Object.keys(this.props.fileLabels).forEach(prop => {
                options[prop] = this.props.fileLabels[prop].name;
            });

            return (
                <div className="file-view__label-select">
                    <Select
                        value={this.props.file.label}
                        nullable={true}
                        nullText={'No label selected'}
                        options={options}
                        onChange={value => this.handleLabelFile(value)}
                        openIcon={'edit'}
                        closeIcon={'edit'}
                    />
                </div>
            );
        }
        return null;
    }

    render() {
        return (
            <div className={helpers.className('file-view', this.props.style)}>
                <div className="file-view__header">
                    <Title style={['small']}>{this.props.file.name}</Title>
                    {this.getFileDescription()}
                    {this.renderLabelSelect()}
                </div>
                <div className="file-view__content">
                    <div className="file-view__preview">
                        <FilePreview
                            style="full"
                            file={this.props.file}
                            mediaConversion={'preview'}
                        />
                    </div>
                    <DefinitionList data={[
                        ['Uploaded', this.props.file.created_at],
                        ['Modified', this.props.file.updated_at],
                        ['Size', file.filesize(this.props.file.size)],
                        ['Disk', this.props.file.disk],
                        ['Mimetype', this.props.file.mime_type]
                    ]} />
                </div>
                <div className="file-view__actions">
                    <Button text={'Rename'} onClick={this.renameFile.bind(this)} style={['secondary', 'full']} />
                    <Button text={'Download'} onClick={this.downloadFile.bind(this)} style={['secondary', 'full']} />
                </div>
                <div className="file-view__footer">
                    <Button text={'Delete file'} onClick={this.deleteFile.bind(this)} style={['full']} />
                </div>
            </div>
        );
    }
}
