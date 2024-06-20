import React from 'react';
import helpers from "../../util/helpers";
import IconButton from "./icon-button";
import Button from "./button";

class Dropdown extends React.Component {

    static defaultProps = {
        label: '',
        text: '',
        style: [],
        autoClose: false,
        autoCloseOnContentClick: true,
        openIcon: 'expand_more',
        closeIcon: 'expand_less',
        stopPropagation: true
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            dropDirectionX: 'right',
            dropDirectionY: 'down'
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
        if (this.props.autoClose) {
            this.close();
        } else if (! this.dropdownRef.current.contains(e.target)) {
            this.close();
        }
    }

    toggle(e) {

        if (this.props.stopPropagation) {
            e.stopPropagation();
        }

        if (this.state.isOpen) {
            this.close();
        } else {
            let centerY = window.innerHeight / 2;
            let centerX = window.innerWidth / 2;
            this.open((e.clientX > centerX ? 'left' : 'right'), (e.clientY > centerY ? 'up' : 'down'));
        }
    }

    open(directionX = 'right', directionY = 'down') {
        this.setState({
            isOpen: true,
            dropDirectionX: directionX,
            dropDirectionY: directionY
        }, () => {
            this.bindDocumentClick();
        });
    }

    close() {
        this.setState({
            isOpen: false
        }, () => {
            this.unbindDocumentClick();
        });
    }

    onContentClick(e) {
        if (! e.target.classList.contains('dropdown__content') && this.props.autoCloseOnContentClick) {
            this.close();
        }
    }

    render() {

        let button = (
            <Button
                stopPropagation={this.props.stopPropagation}
                text={this.props.text}
                label={this.props.label}
                style={[...this.props.style, 'small']}
                onClick={this.toggle.bind(this)}
                icon={(this.state.isOpen ? this.props.closeIcon : this.props.openIcon)}
            />
        );

        if (! this.props.text) {
            button = (
                <IconButton
                    stopPropagation={this.props.stopPropagation}
                    name={(this.state.isOpen ? this.props.closeIcon : this.props.openIcon)}
                    iconStyle={'small'}
                    onClick={this.toggle.bind(this)}
                />
            );
        }

        return (
            <div className={helpers.className('dropdown', this.props.style)+(this.state.isOpen ? ' dropdown--open' : '')+(' dropdown--'+this.state.dropDirectionX)+(' dropdown--'+this.state.dropDirectionY)} ref={this.dropdownRef}>
                <div className="dropdown__trigger">
                    {button}
                </div>
                <div className="dropdown__content" onClick={this.onContentClick.bind(this)}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Dropdown;
