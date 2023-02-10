import React from 'react';

import ContextMenu from "../core/ui/context-menu";
import Dropdown from "../core/ui/dropdown";
import SelectList from "../core/ui/select-list";
import str from "../util/str";
import api from "../api/api";

class BelongsToFilter extends React.Component {

    static defaultProps = {
        id: 0,
        type: '',
        field: '',
        label: '',
        titleColumn: '',
        onChange: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            options: {},
            humanReadableValue: 'All'
        };

        this.selectListRef = React.createRef();
    }

    componentDidMount() {
        this.load();
    }

    load() {
        // Load the data from the backend (with id as param)
        api.execute.get(this.props.path, this.props.id,'load', this.props.path.params).then(response => {

            let options = {};
            let data = response.data.data;

            data.forEach(row => {
                options[row.id] = row[this.props.titleColumn];
            });

            this.setState({
                options: options
            });
        });
    }

    handleChange(values = []) {

        let readableValues = values.map(value => this.state.options[value]);

        this.setState({
            humanReadableValue: (readableValues.length ? readableValues.join(', ') : 'All')
        });

        this.props.onChange(this.props.id, values.join(','));
    }

    clear() {
        this.selectListRef.current.clear();
    }

    onCtxMenuClick(action) {
        if (action === 'clear') {
            this.clear();
        }
    }

    render() {

        let label = (this.props.label ? this.props.label : str.toUpperCaseFirst(this.props.field));

        return (
            <div className="enum-filter">
                <ContextMenu onClick={this.onCtxMenuClick.bind(this)} links={[
                    ['Clear this filter', 'clear']
                ]}>
                    <Dropdown stopPropagation={false} style={['secondary']} label={label} text={this.state.humanReadableValue}>
                        <SelectList
                            options={this.state.options}
                            onChange={this.handleChange.bind(this)}
                            onClear={this.handleChange.bind(this)}
                            ref={this.selectListRef}
                        />
                    </Dropdown>
                </ContextMenu>
            </div>
        );
    }
}

export default BelongsToFilter;
