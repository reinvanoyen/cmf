import React from 'react';
import TextField from "./text-field";
import str from "../util/str";
import util from "../core/ui/util";

export default class TextToSlugField extends TextField {

    static defaultProps = {
        data: {},
        path: {},
        type: '',
        id: 0,
        label: '',
        slugName: '',
        slugPrefix: '',
        tooltip: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            slugValue: ''
        };
    }

    handleSubmit(data) {
        data[this.props.name] = this.state.value;
        data[this.props.slugName] = this.state.slugValue;
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.name] !== prevProps.data[this.props.name]) {
            this.setState({
                value: this.props.data[this.props.name],
                slugValue: this.props.data[this.props.slugName]
            });
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value,
            slugValue: str.slugify(e.target.value)
        });
    }

    renderSlugPrefix() {
        return (
            <span className="text-to-slug-field__slug-prefix">
                {this.props.slugPrefix}
            </span>
        );
    }

    changeSlugValue() {
        util.prompt({
            title: 'Update slug',
            defaultValue: this.state.slugValue,
            confirm: (newSlug) => {
                this.setState({
                    slugValue: str.slugify(newSlug)
                });
            }
        });
    }

    render() {

        let slug = (
            <span className={'text-to-slug-field__slug-placeholder'}>
                –
            </span>
        );

        if (this.state.slugValue) {
            slug = (
                <React.Fragment>
                    {this.renderSlugPrefix()}
                    <span className="text-to-slug-field__slug-slug" onClick={this.changeSlugValue.bind(this)}>
                        {this.state.slugValue}
                    </span>
                </React.Fragment>
            );
        }

        return (
            <div className="text-to-slug-field">
                <div className="text-to-slug-field__field">
                    {super.render()}
                </div>
                <div className="text-to-slug-field__slug">
                    {slug}
                </div>
            </div>
        );
    }
}
