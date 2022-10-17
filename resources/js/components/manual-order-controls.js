import React from 'react';
import IconButton from "../core/ui/icon-button";
import api from "../api/api";
import path from "../state/path";
import util from "../core/ui/util";

class ManualOrderControls extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        type: '',
        id: 0
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {

    }

    sortUp() {

        let params = {};

        if (this.props.data && this.props.data.id) {
            params.id = this.props.data.id;
        }

        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'sortUp', params).then(response => {
            path.refresh();
            util.notify('Item has been sorted up!');
        });
    }

    sortDown() {

        let params = {};

        if (this.props.data && this.props.data.id) {
            params.id = this.props.data.id;
        }

        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'sortDown', params).then(response => {
            path.refresh();
            util.notify('Item has been sorted down!');
        });
    }

    render() {
        return (
            <div className={'manual-order-controls'}>
                <div className={'manual-order-controls__item'}>
                    <IconButton name={'arrow_upward'} onClick={this.sortUp.bind(this)}/>
                </div>
                <div className={'manual-order-controls__item'}>
                    <IconButton name={'arrow_downward'} onClick={this.sortDown.bind(this)} />
                </div>
            </div>
        );
    }
}

export default ManualOrderControls;
