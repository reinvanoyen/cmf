import React from 'react';
import helpers from "../util/helpers";

export default class TextLiteral extends React.Component {

    static defaultProps = {
        id: 0,
        text: '',
        url: '',
        style: ''
    };

    goToUrl(e) {
        e.stopPropagation();
    }

    render() {

        let content = this.props.text;

        if (this.props.url) {

            let href = (this.props.url === true ? content : this.props.data[this.props.id+'_url']);

            content = (
                <a className="text-literal__link" target="_blank" href={href} onClick={this.goToUrl.bind(this)}>
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
