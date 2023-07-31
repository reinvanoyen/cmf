import React from 'react';
import IconButton from "../core/ui/icon-button";
import api from "../api/api";
import path from "../state/path";
import util from "../core/ui/util";

class TreeOrderControls extends React.Component {

    static defaultProps = {
        path: {},
        data: {},
        type: '',
        id: 0
    };

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data[this.props.id + '_tree'] || null
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.id+'_tree'] !== prevProps.data[this.props.id+'_tree']) {
            this.setState({
                data: this.props.data[this.props.id+'_tree'] || null
            });
        }
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

    nestIn() {

        let params = {};

        if (this.props.data && this.props.data.id) {
            params.id = this.props.data.id;
        }

        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'nestIn', params).then(response => {
            path.refresh();
            util.notify('Item has been nested!');
        });
    }

    nestOut() {

        let params = {};

        if (this.props.data && this.props.data.id) {
            params.id = this.props.data.id;
        }

        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'nestOut', params).then(response => {
            path.refresh();
            util.notify('Item has been nested out!');
        });
    }

    renderNestingDepth() {
        if (this.state.data) {

            if (this.state.data.depth === 0) {
                return (
                    <div className={'manual-order-controls__item'}>
                        <IconButton style={'transparent'} iconStyle={'small'} name={'chevron_right'} onClick={this.nestIn.bind(this)} />
                    </div>
                );
            }

            const depth = this.state.data.depth + 1;

            return [...Array(depth)].map((x, i) => {

                if (i === 0) {
                    return (
                        <div className={'manual-order-controls__item'} key={i}>
                            <IconButton style={'transparent'} iconStyle={'small'} name={'chevron_left'} onClick={this.nestOut.bind(this)} />
                        </div>
                    );
                }

                return (
                    <div className={'manual-order-controls__item'} key={i}>
                        <IconButton style={'transparent'} iconStyle={'small'} name={''} onClick={this.sortDown.bind(this)} />
                    </div>
                );
            });
        }

        return null;
    }

    render() {

        return (
            <div className={'manual-order-controls'}>
                <div>ID{this.props.data.id ? this.props.data.id : 0}</div>
                <div className={'manual-order-controls__item'}>
                    <IconButton style={'transparent'} iconStyle={'small'} name={'expand_less'} onClick={this.sortUp.bind(this)}/>
                </div>
                <div className={'manual-order-controls__item'}>
                    <IconButton style={'transparent'} iconStyle={'small'} name={'expand_more'} onClick={this.sortDown.bind(this)} />
                </div>
                {this.renderNestingDepth()}
            </div>
        );
    }
}

export default TreeOrderControls;
