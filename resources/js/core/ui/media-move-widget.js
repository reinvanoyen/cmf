import React from 'react';
import Window from "./window";
import DirectoryList from "./directory-list";
import Button from "./button";
import Breadcrumbs from "./breadcrumbs";
import api from "../../api/api";
import Placeholder from "./placeholder";

class MediaMoveWidget extends React.Component {

    static defaultProps = {
        directory: null,
        onCancel: directoryId => {},
        onConfirm: directoryId => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            currentDirectory: this.props.directory ? this.props.directory : null,
            directoryId: this.props.directory ? this.props.directory.id : null,
            directoryPath: []
        };
    }

    componentDidMount() {
        this.load();
    }

    async load() {
        api.media.path(this.state.directoryId).then(response => {
            let data = response.data.data;
            let last = data[data.length - 1];

            this.setState({
                currentDirectory: last,
                directoryPath: data
            });
        });
    }

    changeDirectory(directoryId = null) {
        this.setState({directoryId}, () => {
            this.load();
        });
    }

    renderBreadcrumbs() {
        return (
            <Breadcrumbs
                items={this.state.directoryPath}
                onClick={item => {
                    if (item) {
                        this.changeDirectory(item.id);
                        return;
                    }
                    this.changeDirectory();
                }}
            />
        );
    }

    render() {

        let placeholderText = 'The home directory doesn\'t have any subdirectories';
        let placeholderBtnText = 'Move file(s) to home';

        if (this.state.currentDirectory) {
            placeholderText = `"${this.state.currentDirectory.name}" doesn\'t have any subdirectories`;
            placeholderBtnText = `Move file(s) to "${this.state.currentDirectory.name}"`;
        }

        return (
            <Window
                style={['fixed-size']}
                title={'Move file(s)'}
                toolbar={this.renderBreadcrumbs()}
                footer={[
                    <Button
                        key={'cancel'}
                        text={'Cancel'}
                        style={'secondary'}
                        onClick={e => this.props.onCancel(this.state.directoryId)}
                    />,
                    <Button
                        key={'confirm'}
                        text={placeholderBtnText}
                        onClick={e => this.props.onConfirm(this.state.directoryId)}
                    />
                ]}
            >
                <DirectoryList
                    style={'compact-list'}
                    directory={this.state.directoryId}
                    onDirectoryClick={this.changeDirectory.bind(this)}
                    placeholder={(
                        <Placeholder icon={'create_new_folder'} button={placeholderBtnText} onClick={e => this.props.onConfirm(this.state.directoryId)}>
                            {placeholderText}
                        </Placeholder>
                    )}
                />
            </Window>
        );
    }
}

export default MediaMoveWidget;
