import React from 'react';
import Icon from "./icon";
import helpers from "../../util/helpers";

class Dropdown extends React.Component {

    static defaultProps = {
        label: '',
        text: '',
        style: null,
        openIcon: 'expand_more',
        closeIcon: 'expand_less'
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };

        this.dropdownRef = React.createRef();
        this.handleDocumentClick = this.onDocumentClick.bind(this);
    }

    componentWillUnmount() {
        this.unbindDocumentClick();
    }

    bindDocumentClick() {
        document.addEventListener('click', this.handleDocumentClick);
    }

    unbindDocumentClick() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    onDocumentClick(e) {
        if (! this.dropdownRef.current.contains(e.target)) {
            this.close();
        }
    }

    toggle(e) {
        e.stopPropagation();
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.setState({
            isOpen: true
        });
        this.bindDocumentClick();
    }

    close() {
        this.setState({
            isOpen: false
        });
        this.unbindDocumentClick();
    }

    render() {

        let label = (this.props.label ? <span className={'dropdown__label'}>{this.props.label}</span> : null);

        return (
            <div className={helpers.className('dropdown', this.props.style)+(this.state.isOpen ? ' dropdown--open' : '')} ref={this.dropdownRef}>
                <div className="dropdown__trigger">
                    <button className={'dropdown__button'} onClick={this.toggle.bind(this)} type={'button'}>
                        {label}
                        {this.props.text}
                        <span className={'dropdown__icon'}>
                            <Icon name={(this.state.isOpen ? this.props.closeIcon : this.props.openIcon)} />
                        </span>
                    </button>
                </div>
                <div className="dropdown__content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Dropdown;
