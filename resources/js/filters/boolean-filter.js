import React from 'react';

import str from "../util/str";
import BooleanSwitcher from "../core/ui/boolean-switcher";

class BooleanFilter extends React.Component {

    static defaultProps = {
        id: 0,
        type: '',
        field: '',
        label: '',
        onChange: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            value: false
        };
    }

    switch(values = []) {

        this.setState({
            value: ! this.state.value
        }, () => {
            this.props.onChange(this.props.id, this.state.value);
        });
    }

    clear() {
        this.setState({
            value: false
        });
    }

    render() {

        let label = (this.props.label ? this.props.label : str.toUpperCaseFirst(this.props.field));

        return (
            <div className="boolean-filter" onClick={this.switch.bind(this)}>
                <div className="boolean-filter__label">
                    {label}
                </div>
                <BooleanSwitcher checked={this.state.value} style={['alt', 'small']} />
            </div>
        );
    }
}

export default BooleanFilter;
