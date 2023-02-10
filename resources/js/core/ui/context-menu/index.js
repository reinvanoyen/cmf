import './index.scss';

import React from 'react';
import LinkList from "../link-list";
import { createRoot } from "react-dom/client";

class ContextMenu extends React.Component {

    static defaultProps = {
        links: [],
        onClick: path => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            x: 0,
            y: 0
        };

        this.contextMenuContainerRef = React.createRef();
        this.contextMenuRef = React.createRef();

        this.handleDocumentClick = this.onDocumentClick.bind(this);
        this.handleDocumentCtxMenu = this.onDocumentCtxMenu.bind(this);

        this.ctxOverlayEl = null;
        this.ctxMountEl = null;
        this.root = null;
    }

    componentWillUnmount() {
        this.unbindDocumentClick();
    }

    bindDocumentClick() {
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('contextmenu', this.handleDocumentCtxMenu);
    }

    unbindDocumentClick() {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('contextmenu', this.handleDocumentCtxMenu);
    }

    onDocumentCtxMenu(e) {
        if (! this.contextMenuContainerRef.current.contains(e.target)) {
            this.close();
        }
    }

    onDocumentClick(e) {
        if (! this.contextMenuRef.current.contains(e.target)) {
            this.close();
        }
    }

    onLinkClick(action) {
        this.close(() => {
            this.props.onClick(action);
        });
    }

    toggle(e) {
        e.stopPropagation();
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open(x, y) {

        this.setState({
            isOpen: true,
            x: x,
            y: y
        }, () => {

            this.bindDocumentClick();

            this.ctxOverlayEl = document.body.appendChild(document.createElement('div'));
            this.ctxOverlayEl.classList.add('ctx-overlay');

            this.ctxMountEl = document.body.appendChild(document.createElement('div'));
            this.ctxMountEl.classList.add('ctx-mount');

            this.root = createRoot(this.ctxMountEl);
            this.root.render(this.renderContextMenu());
        });
    }

    close(cb) {
        this.setState({
            isOpen: false
        }, () => {
            this.unbindDocumentClick();

            this.ctxOverlayEl.remove();
            this.ctxMountEl.remove();
            this.root = null;

            if (cb) {
                cb();
            }
        });
    }

    handleContextMenu(e) {
        this.open(e.pageX, e.pageY);
        e.stopPropagation();
        e.preventDefault();
    }

    renderContextMenu() {
        return (
            <div className="context-menu__menu" style={{left: `${this.state.x}px`, top: `${this.state.y}px`}} ref={this.contextMenuRef}>
                <LinkList links={this.props.links} onClick={this.onLinkClick.bind(this)} />
            </div>
        );
    }

    render() {
        return (
            <div className={'context-menu'+(this.state.isOpen ? ' context-menu--open' : '')} onContextMenu={this.handleContextMenu.bind(this)} ref={this.contextMenuContainerRef}>
                <div className="context-menu__wrap">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default ContextMenu;
