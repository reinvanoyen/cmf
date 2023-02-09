import './index.scss';

import React from 'react';
import Button from "../button";
import IconButton from "../icon-button";

class ButtonGroup extends React.Component {

    static defaultProps = {
        buttons: [],
        active: null,
        onClick: (key) => {}
    };

    renderButtons() {
        return this.props.buttons.map((button, i) => {
            return (
                <div className="button-group__item" key={i}>
                    {(button.text ?
                        <Button
                            onClick={() => this.props.onClick(button.key)}
                            text={button.text}
                            icon={button.icon}
                            style={['grouped', 'secondary', 'small', (this.props.active && this.props.active === button.key ? 'active' : 'default')]}
                        /> :
                        <IconButton
                            onClick={() => this.props.onClick(button.key)}
                            name={button.icon}
                            style={['grouped', (this.props.active && this.props.active === button.key ? 'active' : 'default')]}
                        />)}
                </div>
            );
        });
    }

    render() {
        return (
            <div className="button-group">
                {this.renderButtons()}
            </div>
        );
    }
}

export default ButtonGroup;
