import React from 'react';
import Icon from "./icon";

class SelectList extends React.Component {

    static defaultProps = {
        onChange: values => {},
        multiple: true,
        options: {},
        defaultValues: []
    };

    constructor(props) {
        super(props);

        this.state = {
            values: this.props.defaultValues
        };
    }

    renderOptions() {

        let options = [];

        for (let value in this.props.options) {
            if (this.props.options.hasOwnProperty(value)) {

                let isSelected = this.state.values.includes(value);
                let icon;

                if (this.props.multiple) {
                    icon = <Icon name={isSelected ? 'check_box' : 'check_box_outline_blank'} />
                } else {
                    icon = <Icon name={isSelected ? 'radio_button_checked' : 'radio_button_unchecked'} />;
                }

                options.push(
                    <div className={'select-list__option'+(isSelected ? ' select-list__option--selected' : '')} onClick={e => this.handleOptionClick(value)} key={value}>
                        <div className="select-list__option-icon">
                            {icon}
                        </div>
                        <div className="select-list__option-value">
                            {this.props.options[value]}
                        </div>
                    </div>
                );
            }
        }

        return options;
    }

    clear() {
        this.setState({
            values: []
        }, () => {
            this.props.onChange(this.state.values);
        });
    }

    handleOptionClick(value) {
        if (this.props.multiple) {
            this.toggleSelection(value);
        } else {
            this.selectOnly(value);
        }
    }

    selectOnly(value) {
        this.setState({
            values: [value]
        }, () => {
            this.props.onChange(this.state.values);
        });
    }

    toggleSelection(value) {

        if (this.state.values.includes(value)) {
            this.state.values = this.state.values.filter(v => v !== value);
        } else {
            this.state.values.push(value);
        }

        this.setState({
            values: this.state.values
        }, () => {
            this.props.onChange(this.state.values);
        });
    }

    render() {
        return (
            <div className={'select-list'}>
                <div className="select-list__options">
                    {this.renderOptions()}
                </div>
            </div>
        );
    }
}

export default SelectList;
