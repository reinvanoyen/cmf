import React from 'react';
import helpers from "../util/helpers";

export default class TextLiteral extends React.Component {

    static defaultProps = {
        id: 0,
        text: '',
        url: '',
        style: ''
    };

    render() {

        let content = this.props.text;

        if (this.props.url) {
            content = (
                <a className="text-literal__link" target="_blank" href={this.props.url}>
                    {this.props.text}
                </a>
            );
        }

        return (
            <div className={helpers.className('text-literal', this.props.style)}>
                {content}
            </div>
        );
    }
}
