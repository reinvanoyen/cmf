import React from 'react';
import Window from "./window";
import Button from "./button";
import DirectoryTree from "./directory-tree";
import util from "./util";

class MediaMoveWidget extends React.Component {

    static defaultProps = {
        directory: null,
        onCancel: () => {},
        onConfirm: directoryId => {}
    };

    confirmMove(id) {
        util.confirm({
            title: 'Move files',
            text: 'Are you sure you wish to move files here?',
            confirmButtonText: 'Yes, move files',
            cancelButtonText: 'No',
            confirm: () => this.props.onConfirm(id)
        });
    }

    render() {
        return (
            <Window style={['modal']} title={'Move file(s)'}
                footer={[
                    <Button
                        key={'cancel'}
                        text={'Cancel'}
                        style={'secondary'}
                        onClick={e => this.props.onCancel()}
                    />
                ]}
            >
                <DirectoryTree onDirectoryClick={id => this.confirmMove(id)} />
            </Window>
        );
    }
}

export default MediaMoveWidget;
