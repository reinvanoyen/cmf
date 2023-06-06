import React from 'react';
import Field from "../core/ui/field";
import util from "../core/ui/util";
import i18n from "../util/i18n";
import IconButton from "../core/ui/icon-button";

export default class buttonField extends React.Component {

    static defaultProps = {
        data: {},
        path: {},
        type: '',
        id: 0,
        label: '',
        name: '',
        urlColumnName: '',
        tooltip: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.data[this.props.name] || '',
            urlValue: this.props.data[this.props.urlColumnName] || ''
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                value: this.props.data[this.props.name] || '',
                urlValue: this.props.data[this.props.urlColumnName] || ''
            });
        }
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;
        data[this.props.urlColumnName] = this.state.urlValue;
    }

    getData(data) {
        data[this.props.name] = this.state.value || '';
        data[this.props.urlColumnName] = this.state.urlValue || '';
        return data;
    }

    changeValue() {
        util.prompt({
            title: i18n.get('snippets.edit_button_text'),
            defaultValue: this.state.value,
            confirm: (value) => {
                this.setState({value});
            }
        });
    }

    changeUrlValue() {
        util.prompt({
            title: i18n.get('snippets.edit_button_url'),
            defaultValue: this.state.urlValue,
            confirm: (urlValue) => {
                this.setState({urlValue});
            }
        });
    }

    render() {
        return (
            <Field
                name={this.props.name}
                label={this.props.label}
                errors={this.props.errors}
                tooltip={this.props.tooltip}
            >
                <div className="button-field">
                    <div className="button-field__wrap">
                        <div className="button-field__entry">
                            <div className="button-field__button">
                                {this.state.value ? this.state.value : '– '+i18n.get('snippets.none')+' –'}
                            </div>
                            <IconButton name={'edit'} style={'transparent'} onClick={this.changeValue.bind(this)} />
                        </div>
                        {this.state.value ? (
                        <div className="button-field__entry">
                            <div className="button-field__url">
                                {this.state.urlValue ? <a href={this.state.urlValue} title={this.state.value} target="_blank">{this.state.urlValue}</a> : '– '+i18n.get('snippets.none')+' –'}
                            </div>
                            <IconButton name={'link'} style={'transparent'} onClick={this.changeUrlValue.bind(this)} />
                        </div>) : ''}
                    </div>
                </div>
            </Field>
        );
    }
}
