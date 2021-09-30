import React from 'react';
import UiDropdown from "../core/ui/dropdown";
import LinkList from "../core/ui/link-list";
import path from "../state/path";

class Dropdown extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        text: '',
        links: [],
        style: null
    };

    goTo(actionPath) {

        let params = {};

        if (this.props.data && this.props.data.id) {
            params.id = this.props.data.id;
        } else if (this.props.path.params.id) {
            params.id = this.props.path.params.id;
        }

        path.goTo(this.props.path.module, actionPath, params);
    }

    render() {
        return (
            <UiDropdown text={this.props.text} style={this.props.style}>
                <LinkList links={this.props.links} onClick={actionPath => this.goTo(actionPath)} />
            </UiDropdown>
        );
    }
}

export default Dropdown;
