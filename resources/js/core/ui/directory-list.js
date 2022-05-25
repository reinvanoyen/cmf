import React from 'react';
import api from "../../api/api";
import Icon from "./icon";
import helpers from "../../util/helpers";
import Placeholder from "./placeholder";

class DirectoryList extends React.Component {

    static defaultProps = {
        directory: null,
        style: 'list',
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

            let directories = response.data.data;

            this.setState({directories});
        });
    }

    render() {

        if (! this.state.directories.length) {
            if (this.props.placeholder) {
                return this.props.placeholder;
            }
            return null;
        }

        let iconStyle = [(this.props.style === 'compact-list' ? 'default' : 'large'), 'alt'];

        return (
            <div className={helpers.className('directory-list', this.props.style)}>
                {this.state.directories.map((directory, i) => {
                    return (
                        <div className="directory-list__item" key={i}>
                            <div className={helpers.className('directory', this.props.style)} onClick={e => this.props.onDirectoryClick(directory.id)}>
                                <div className="directory__icon">
                                    <Icon name={'folder'} style={iconStyle} />
                                </div>
                                <div className="directory__name">
                                    {directory.name}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default DirectoryList;
