import React from 'react';
import helpers from "../../util/helpers";
import IconButton from "./icon-button";

class Window extends React.Component {

    static defaultProps = {
        title: '',
        style: 'default',
        toolbar: null,
        footer: null,
        closeable: false,
        onClose: () => {}
    };

    close() {
        this.props.onClose();
    }

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

    renderActions() {
        if (this.props.closeable) {
            return <IconButton name={'close'} style={'transparent'} onClick={this.close.bind(this)} />;
        }
        return null;
    }

    render() {
        return (
            <div className={helpers.className('window', this.props.style)}>
                <div className="window__header">
                    <div className="window__title">
                        {this.props.title}
                    </div>
                    <div className="window__actions">
                        {this.renderActions()}
                    </div>
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
