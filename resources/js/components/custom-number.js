import React from 'react';
import api from "../api/api";
import Icon from "../core/ui/icon";

class CustomNumber extends React.Component {

    static defaultProps = {
        path: {},
        type: '',
        id: 0,
        style: 'default',
        icon: null,
        title: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            number: '-'
        };
    }

    componentDidMount() {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', this.props.path.params).then(response => {
            this.setState({
                number: response.data
            });
        });
    }

    render() {

        let icon = (this.props.icon ? <div className="custom-number__icon"><Icon name={this.props.icon} style={['medium', 'soft']} /></div> : null);
        let title = (this.props.title ? <div className="custom-number__title">{this.props.title}</div> : null);

        return (
            <div className={'custom-number custom-number--'+this.props.style}>
                {icon}
                {this.state.number}
                {title}
            </div>
        );
    }
}

export default CustomNumber;
