import React from 'react';
import util from "../core/ui/util";
import Icon from "../core/ui/icon";
import str from "../util/str";
import i18n from "../util/i18n";

class TextView extends React.Component {

    static defaultProps = {
        path: {},
        type: '',
        id: 0,
        label: '',
        url: false,
        truncateLength: 0,
        truncateSuffix: '',
        copyable: false,
        style: 'default'
    };

    goToUrl(e) {
        e.stopPropagation();
    }

    copyValue() {
        util.copyText(this.props.data[this.props.name], () => {
            util.notify(i18n.get('snippets.copied_to_clipboard'));
        });
    }

    renderCopyIcon() {
        if (this.props.copyable) {
            return (
                <span className="text-view__copy">
                    <Icon onClick={this.copyValue.bind(this)} name={'content_copy'} style={'mini'} />
                </span>
            );
        }
        return null;
    }

    render() {

        let label, value = '-';

        if (this.props.label) {
            label = (
                <label className="label text-view__label">
                    {this.props.label}
                </label>
            );
        }

        if (this.props.data && this.props.data[this.props.name]) {

            value = this.props.data[this.props.name];

            if (this.props.url) {

                let href = (this.props.url === true ? value : this.props.data[this.props.name+'_url']);

                value = (
                    <a href={href} target="_blank" title={value} className={'text-view__url'} onClick={this.goToUrl.bind(this)}>
                        {(this.props.truncateLength ? str.truncate(value, this.props.truncateLength, this.props.truncateSuffix) : value)}
                    </a>
                );
            }
        }

        return (
            <div className={'text-view text-view--'+this.props.style}>
                {label}
                <span className={'text-view__value'}>
                    {value}
                    {this.renderCopyIcon()}
                </span>
            </div>
        );
    }
}

export default TextView;
