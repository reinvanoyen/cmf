"use strict";

import React from 'react';
import FilePreview from "./file-preview";
import fileUtil from "../../util/file";
import IconButton from "./icon-button";
import TagLabel from "./tag-label";
import mimetypes from '../../data/mimetypes';

export default class File extends React.Component {

    static defaultProps = {
        file: {},
        fileLabels: {},
        isSelected: false,
        selectionMode: false,
        viewMode: 'list',
        actions: [],
        onClick: (e, file) => {}
    };

    renderActions() {
        if (! this.props.actions.length) {
            return null;
        }

        return (
            <div className="file__actions">
                {this.props.actions}
            </div>
        );
    }

    renderSelectionMode() {

        if (! this.props.selectionMode) {
            return null;
        }

        return (
            <div className="file__checkbox">
                <IconButton
                    onClick={e => this.props.onClick(e, this.props.file)}
                    name={(this.props.isSelected ? 'check_box' : 'check_box_outline_blank')}
                    style={'transparent'}
                />
            </div>
        );
    }

    renderLabel() {
        if (Object.keys(this.props.fileLabels).length) {
            let label = (this.props.fileLabels[this.props.file.label] || null);
            if (label) {
                return (
                    <div className="file__label">
                        <TagLabel text={label.name} color={label.color} style={this.props.viewMode === 'grid' || this.props.viewMode === 'compact-list' ? ['small'] : []}/>
                    </div>
                );
            }
        }
        return null;
    }

    getFileType() {

        let map = mimetypes;

        if (! map[this.props.file.mime_type]) {
            return 'unknown';
        }

        return map[this.props.file.mime_type].description;
    }

    render() {

        let filePreviewModifiers = [];
        if (this.props.viewMode === 'grid') {
            filePreviewModifiers = ['grid', 'full'];
        } else if (this.props.viewMode === 'list') {
            filePreviewModifiers = ['list'];
        } else if (this.props.viewMode === 'compact-list') {
            filePreviewModifiers = ['compact-list'];
        }

        return (
            <div className={'file file--'+this.props.viewMode+(this.props.isSelected ? ' file--selected' : '')} onClick={e => this.props.onClick(e, this.props.file)}>
                {this.renderSelectionMode()}
                <div className="file__preview">
                    <FilePreview
                        file={this.props.file}
                        mediaConversion={this.props.viewMode === 'grid' ? 'contain' : 'thumb'}
                        style={filePreviewModifiers}
                    />
                </div>
                <div className="file__content">
                    <div className="file__name">
                        {this.props.file.name}
                    </div>
                    <div className="file__type">
                        {this.getFileType()}
                    </div>
                    <div className="file__size">
                        {fileUtil.filesize(this.props.file.size)} ({this.props.file.disk})
                    </div>
                </div>
                {this.renderLabel()}
                {this.renderActions()}
            </div>
        );
    }
}
