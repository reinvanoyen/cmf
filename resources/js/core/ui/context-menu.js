import React from 'react';
import LinkList from "./link-list";

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
        this.close();
        this.props.onClick(action);
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
        });
        this.bindDocumentClick();
    }

    close() {
        this.setState({
            isOpen: false
        });
        this.unbindDocumentClick();
    }

    handleContextMenu(e) {
        this.open(e.pageX - window.scrollX, e.pageY - window.scrollY);
        e.preventDefault();
    }

    renderContextMenu() {
        if (! this.state.isOpen) {
            return null;
        }

        return (
            <div className="context-menu__menu" style={{transform: `translateX(${this.state.x}px) translateY(${this.state.y}px)`}} ref={this.contextMenuRef}>
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
                {this.renderContextMenu()}
            </div>
        );
    }
}

export default ContextMenu;
