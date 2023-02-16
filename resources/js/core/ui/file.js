"use strict";

import React from 'react';
import FilePreview from "./file-preview";
import fileUtil from "../../util/file";
import IconButton from "./icon-button";
import TagLabel from "./tag-label";
import mimetypes from '../../data/mimetypes';
import { useSelector } from "react-redux";

function File(props) {

    const { viewMode } = useSelector(state => state.media);

    const renderActions = () => {
        if (! props.actions.length) {
            return null;
        }

        return (
            <div className="file__actions">
                {props.actions}
            </div>
        );
    }

    const renderSelectionMode = () => {

        if (! props.selectionMode) {
            return null;
        }

        return (
            <div className="file__checkbox">
                <IconButton
                    onClick={e => props.onClick(e, props.file)}
                    name={(props.isSelected ? 'check_box' : 'check_box_outline_blank')}
                    style={'transparent'}
                />
            </div>
        );
    }

    const renderLabel = () => {
        if (Object.keys(props.fileLabels).length) {
            let label = (props.fileLabels[props.file.label] || null);
            if (label) {
                return (
                    <div className="file__label">
                        <TagLabel text={label.name} color={label.color} style={viewMode === 'grid' || viewMode === 'compact-list' ? ['small'] : []}/>
                    </div>
                );
            }
        }
        return null;
    }

    const getFileType = () => {

        let map = mimetypes;

        if (! map[props.file.mime_type]) {
            return 'unknown';
        }

        return map[props.file.mime_type].description;
    }

    const render = () => {

        let filePreviewModifiers = [];
        const realViewMode = (props.viewMode ? props.viewMode : viewMode);

        switch (realViewMode) {
            case 'grid':
                filePreviewModifiers = ['grid', 'full'];
                break;
            case 'list':
                filePreviewModifiers = ['list'];
                break;
            case 'compact-list':
                filePreviewModifiers = ['compact-list'];
                break;
        }

        return (
            <div className={'file file--'+(realViewMode)+(props.isSelected ? ' file--selected' : '')} onClick={e => props.onClick(e, props.file)}>
                {renderSelectionMode()}
                <div className="file__preview">
                    <FilePreview
                        file={props.file}
                        mediaConversion={realViewMode === 'grid' ? 'contain' : 'thumb'}
                        style={filePreviewModifiers}
                    />
                </div>
                <div className="file__content">
                    <div className="file__name">
                        {props.file.name}
                    </div>
                    <div className="file__type">
                        {getFileType()}
                    </div>
                    <div className="file__size">
                        {fileUtil.filesize(props.file.size)} ({props.file.disk})
                    </div>
                </div>
                {renderLabel()}
                {renderActions()}
            </div>
        );
    }

    return render();
}

File.defaultProps = {
    file: {},
    viewMode: '',
    fileLabels: {},
    isSelected: false,
    selectionMode: false,
    actions: [],
    onClick: (e, file) => {}
};

export default File;
