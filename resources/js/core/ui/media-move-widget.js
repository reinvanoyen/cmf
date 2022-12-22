import React from 'react';
import Window from "./window";
import Button from "./button";
import DirectoryTree from "./directory-tree";
import util from "./util";
import i18n from "../../util/i18n";

class MediaMoveWidget extends React.Component {

    static defaultProps = {
        directory: null,
        onCancel: () => {},
        onConfirm: directoryId => {}
    };

    confirmMove(id) {
        util.confirm({
            title: i18n.get('snippets.move'),
            text: i18n.get('snippets.move_files_text'),
            confirmButtonText: i18n.get('snippets.move_files_confirm'),
            cancelButtonText: i18n.get('snippets.move_files_cancel'),
            confirm: () => this.props.onConfirm(id)
        });
    }

    render() {
        return (
            <Window style={['modal']} title={i18n.get('snippets.move')}
                footer={[
                    <Button
                        key={'cancel'}
                        text={i18n.get('snippets.move_files_cancel')}
                        style={'secondary'}
                        onClick={e => this.props.onCancel()}
                    />
                ]}
            >
                <DirectoryTree
                    selectedDirectory={this.props.directory ? this.props.directory.id : null}
                    onDirectoryClick={id => this.confirmMove(id)}
                />
            </Window>
        );
    }
}

export default MediaMoveWidget;
