import React from 'react';
import api from "../api/api";

class CustomNumber extends React.Component {

    static defaultProps = {
        path: {},
        type: '',
        id: 0,
        style: 'default'
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
        return (
            <div className={'custom-number custom-number--'+this.props.style}>
                {this.state.number}
            </div>
        );
    }
}

export default CustomNumber;
