import React from 'react';
import Tags from "../core/ui/tags";

export default class TagsView extends React.Component {

    static defaultProps = {
        id: 0,
        data: {}
    };

    render() {

        if (this.props.data && typeof this.props.data[this.props.id+'_tags'] !== 'undefined') {
            return (
                <div className="tags-view">
                    <Tags tags={this.props.data[this.props.id+'_tags']} />
                </div>
            );
        }

        return null;
    }
}
