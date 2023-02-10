import React from 'react';
import Button from "../core/ui/button";
import UiLink from "../core/ui/link";
import path from "../state/path";

export default class Link extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        action: '',
        back: false,
        style: null
    };

    goTo() {

        if (this.props.back) {
            path.goBack();
            return;
        }

        let params = {};

        if (this.props.data && this.props.data.id) {
            params.id = this.props.data.id;
        } else if (this.props.path.params.id) {
            params.id = this.props.path.params.id;
        }

        path.goTo(this.props.path.module, this.props.action, params);
    }

    render() {

        if (this.props.style && this.props.style !== 'alt') {
            return <Button style={this.props.style} text={this.props.text} onClick={this.goTo.bind(this)} />;
        }

        return <UiLink style={this.props.style} onClick={this.goTo.bind(this)} text={this.props.text} />;
    }
}
