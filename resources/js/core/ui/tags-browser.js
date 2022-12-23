import React from 'react';
import api from "../../api/api";
import Button from "./button";
import Placeholder from "./placeholder";
import Tags from "./tags";
import Window from "./window";
import i18n from "../../util/i18n";

class TagsBrowser extends React.Component {

    static defaultProps = {
        id: 0,
        path: {},
        selectedTags: [],
        onCancel: () => {},
        onConfirm: tags => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            selectedTags: this.props.selectedTags,
            tags: []
        };
    }

    componentDidMount() {
        this.load();
    }

    async load() {
        api.execute.get(this.props.path, this.props.id,'load', {}).then(response => {
            let tags = response.data;
            tags.sort(function (a, b) {
                if (a > b) {
                    return 1;
                }
                if (b > a) {
                    return -1;
                }
                return 0;
            });

            this.setState({
                tags: tags,
                isLoading: false
            });
        });
    }

    onCancel() {
        this.props.onCancel();
    }

    onConfirm() {
        this.props.onConfirm(this.state.selectedTags);
    }

    onTagClick(tag) {
        this.setState({
            selectedTags: [...this.state.selectedTags, tag]
        });
    }

    onSelectedTagClick(tag) {
        let tags = this.state.selectedTags.filter(value => {
            return (value !== tag);
        });

        this.setState({
            selectedTags: tags
        });
    }

    renderContent() {
        if (this.state.isLoading) {
            return null;
        }

        if (! this.state.tags.length) {
            return (
                <Placeholder>{i18n.get('snippets.no_tags_available')}</Placeholder>
            );
        }

        let selected;
        let available;

        if (this.state.selectedTags.length) {
            selected = (
                <div className="tags-browser__selected">
                    <div className="tags-browser__title">
                        {i18n.get('snippets.selected_tags')}
                    </div>
                    <Tags
                        tags={this.state.selectedTags}
                        onClick={this.onSelectedTagClick.bind(this)}
                    />
                </div>
            );
        }

        if (this.state.tags.length) {
            available = (
                <div className="tags-browser__available">
                    <div className="tags-browser__title">
                        {i18n.get('snippets.available_tags')}
                    </div>
                    <Tags
                        tags={this.state.tags}
                        onClick={this.onTagClick.bind(this)}
                    />
                </div>
            );
        }

        return (
            <div className="tags-browser__tags">
                {selected}
                {available}
            </div>
        );
    }

    render() {
        return (
            <Window style={'modal'} title={i18n.get('snippets.tags')} closeable={true} onClose={this.onCancel.bind(this)} footer={[
                <Button key={0} text={i18n.get('snippets.cancel')} style={['secondary']} onClick={this.onCancel.bind(this)} />,
                <Button key={1} text={i18n.get('snippets.confirm')} onClick={this.onConfirm.bind(this)} />
            ]}>
                <div className="tags-browser">
                    <div className="tags-browser__content">
                        {this.renderContent()}
                    </div>
                </div>
            </Window>
        );
    }
}

export default TagsBrowser;
