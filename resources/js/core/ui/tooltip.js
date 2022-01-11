import React from 'react';
import Icon from "./icon";

class Tooltip extends React.Component {

    static defaultProps = {
        text: '',
        icon: 'info'
    };

    constructor(props) {
        super(props);

        this.state = {
            isVisible: false,
            x: 0,
            y: 0
        };
    }

    onClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }

    show(e) {
        this.setState({
            isVisible: true,
            x: e.pageX + 15,
            y: e.pageY - 15
        });
    }

    move(e) {
        this.setState({
            isVisible: true,
            x: e.pageX + 15,
            y: e.pageY - 15
        });
    }

    hide() {
        this.setState({
            isVisible: false
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="tooltip" onMouseEnter={this.show.bind(this)} onMouseOut={this.hide.bind(this)} onMouseMove={this.move.bind(this)}>
                    <Icon style={['small', 'alt']} name={this.props.icon} />
                </div>
                {this.state.isVisible ? <div className="tooltip__text" style={{top: this.state.y, left: this.state.x}}>{this.props.text}</div> : null}
            </React.Fragment>
        );
    }
}

export default Tooltip;
