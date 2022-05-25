import React from 'react';
import helpers from "../../util/helpers";

class Window extends React.Component {

    static defaultProps = {
        title: '',
        style: 'default',
        toolbar: null,
        footer: null
    };

    renderToolbar() {
        if (this.props.toolbar) {
            return (
                <div className="window__toolbar">
                    {this.props.toolbar}
                </div>
            );
        }

        return null;
    }

    renderFooter() {
        if (this.props.footer) {
            return (
                <div className="window__footer">
                    {this.props.footer}
                </div>
            );
        }

        return null;
    }

    render() {
        return (
            <div className={helpers.className('window', this.props.style)}>
                <div className="window__header">
                    {this.props.title}
                </div>
                {this.renderToolbar()}
                <div className="window__content">
                    {this.props.children}
                </div>
                {this.renderFooter()}
            </div>
        );
    }
}

export default Window;
