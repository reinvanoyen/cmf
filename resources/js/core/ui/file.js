"use strict";

import React from 'react';
import FilePreview from "./file-preview";
import fileUtil from "../../util/file";
import IconButton from "./icon-button";
import TagLabel from "./tag-label";

export default class File extends React.Component {

    static defaultProps = {
        file: {},
        fileLabels: {},
        isSelected: false,
        selectionMode: false,
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
                        <TagLabel text={label.name} color={label.color} />
                    </div>
                );
            }
        }
        return null;
    }

    render() {
        return (
            <div className={'file'+(this.props.isSelected ? ' file--selected' : '')} onClick={e => this.props.onClick(e, this.props.file)}>
                {this.renderSelectionMode()}
                <div className="file__preview">
                    <FilePreview file={this.props.file} />
                </div>
                <div className="file__content">
                    <div className="file__name">
                        {this.props.file.name}
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
