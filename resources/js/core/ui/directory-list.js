import React from 'react';
import api from "../../api/api";
import helpers from "../../util/helpers";
import Directory from "./directory";

class DirectoryList extends React.Component {

    static defaultProps = {
        directory: null,
        viewMode: 'list',
        onDirectoryClick: directoryId => {},
        placeholder: null
    };

    constructor(props) {
        super(props);

        this.state = {
            directories: []
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


    async load() {
        await api.media.loadDirectories(this.props.directory).then(response => {
            this.setState({directories: response.data.data});
        });
    }

    render() {

        if (! this.state.directories.length) {
            if (this.props.placeholder) {
                return this.props.placeholder;
            }
            return null;
        }

        return (
            <div className={helpers.className('directory-list', this.props.viewMode)}>
                {this.state.directories.map((directory, i) => {
                    return (
                        <div className="directory-list__item" key={i}>
                            <Directory
                                viewMode={this.props.viewMode}
                                directory={directory}
                                onClick={(e, directory) => this.props.onDirectoryClick(directory.id)}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default DirectoryList;
