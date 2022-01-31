import React from 'react';
import FilePreview from "./file-preview";
import TagLabel from "./tag-label";

export default class FileThumb extends React.Component {

    static defaultProps = {
        mediaConversion: 'thumb',
        fileLabels: {}
    };

    renderLabel() {
        if (Object.keys(this.props.fileLabels).length) {
            let label = (this.props.fileLabels[this.props.file.label] || null);
            if (label) {
                return (
                    <div className="file-thumb__label">
                        <TagLabel
                            text={label.name}
                            color={label.color}
                            style={'small'}
                        />
                    </div>
                );
            }
        }
        return null;
    }

    render() {
        return (
            <div className="file-thumb">
                <div className="file-thumb__preview">
                    <FilePreview
                        file={this.props.file}
                        style={['full']}
                        mediaConversion={this.props.mediaConversion}
                    />
                </div>
                <div className={'file-thumb__name'}>
                    {this.props.file.name}
                </div>
                {this.renderLabel()}
            </div>
        );
    }
}
