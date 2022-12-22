import React from 'react';
import api from "../../api/api";
import TreeItem from "./tree-item";
import i18n from "../../util/i18n";

class DirectoryTree extends React.Component {

    static defaultProps = {
        directory: null,
        selectedDirectory: null,
        onDirectoryClick: directoryId => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            directories: [],
            directoriesMap: {}
        };
    }

    componentDidMount() {
        this.load();
    }

    componentDidUpdate(prevProps) {
        if (this.props.directory !== prevProps.directory) {
            this.load();
        }
    }

    componentWillUnmount() {
        //
    }

    select(directoryId = null) {
        this.props.onDirectoryClick(directoryId);
    }

    async load() {
        await api.media.loadDirectories(this.props.directory).then(response => {
            this.setState({directories: response.data.data});
        });
    }

    async loadChildren(parentId) {
        await api.media.loadDirectories(parentId).then(response => {
            let map = this.state.directoriesMap;
            map[parentId] = response.data.data;
            this.setState({
                directoriesMap: map
            });
        });
    }

    toggleCollapse(parentId) {
        if (! this.state.directoriesMap[parentId]) {
            this.loadChildren(parentId);
            return;
        }

        let map = this.state.directoriesMap;
        delete map[parentId];

        this.setState({
            directoriesMap: map
        });
    }

    renderChildren(parentId) {
        if (! this.state.directoriesMap[parentId]) {
            return null;
        }

        return this.state.directoriesMap[parentId].map(child => {
            return this.renderDirectory(child);
        });
    }

    renderDirectory(directory) {
        return (
            <div className={'directory-tree__item'} key={directory.id}>
                <TreeItem
                    icon={'folder'}
                    text={directory.name}
                    style={(this.props.selectedDirectory === directory.id ? 'selected' : 'default')}
                    onToggle={() => this.toggleCollapse(directory.id)}
                    onClick={() => this.select(directory.id)}
                />
                <div className={'directory-tree__children'}>
                    {this.renderChildren(directory.id)}
                </div>
            </div>
        );
    }

    render() {

        if (! this.state.directories.length) {
            return null;
        }

        return (
            <div className={'directory-tree'}>
                <TreeItem
                    icon={'home'}
                    text={i18n.get('snippets.files_root')}
                    style={(this.props.selectedDirectory === null ? 'selected' : 'default')}
                    collapsible={false}
                    onClick={() => this.select()}
                />
                {this.state.directories.map(directory => {
                    return this.renderDirectory(directory);
                })}
            </div>
        );
    }
}

export default DirectoryTree;
