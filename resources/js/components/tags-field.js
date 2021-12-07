import React from 'react';
import Field from "../core/ui/field";
import api from "../api/api";
import Tags from "../core/ui/tags";

export default class TextField extends React.Component {

    static defaultProps = {
        id: 0,
        data: {},
        label: '',
        disabled: false,
        showRequiredIndicator: false,
        errors: {},
        style: ''
    };

    constructor(props) {
        super(props);

        this.inputRef = React.createRef();
        this.autosuggestTimeout = null;

        this.state = {
            autosuggestIsOpen: false,
            autosuggest: [],
            tags: this.props.data[this.props.id+'_tags'] || []
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.id+'_tags'] !== prevProps.data[this.props.id+'_tags']) {
            this.setState({
                tags: this.props.data[this.props.id+'_tags']
            });
        }
    }

    componentWillUnmount() {
        clearTimeout(this.searchTimeout);
    }

    getData(data) {
        data[this.props.id+'_tags'] = this.state.tags || [];
        return data;
    }

    handleSubmit(data) {
        data[this.props.id+'_tags'] = JSON.stringify(this.state.tags);
    }

    handleChange(e) {

        clearTimeout(this.searchTimeout);
        let value = e.target.value;

        if (! value) {
            this.setState({
                autosuggestIsOpen: false
            });
            return;
        }

        this.searchTimeout = setTimeout(() => this.autosuggest(value), 200);
    }

    handleKeyDown(e) {

        if (e.key === 'Backspace') {
            if (e.target.value === '') {
                this.removeLastTag();
            }
        }

        if (e.key === 'Enter') {

            e.preventDefault();

            let tag = e.target.value.replace(',', '');
            e.target.value = '';
            this.addTag(tag);
        }
    }

    handleKeyUp(e) {
        if (e.key === ',') {
            let tag = e.target.value.replace(',', '');
            e.target.value = '';
            this.addTag(tag);
        }
    }

    handleBlur(e) {

        clearTimeout(this.searchTimeout);

        let el = e.target;
        let value = el.value;

        this.searchTimeout = setTimeout(() => {

            el.value = '';

            this.setState({
                tags: (value ? [...this.state.tags, value] : this.state.tags),
                autosuggestIsOpen: false
            });
        }, 1000);
    }

    handleSuggestionClick(tag) {

        clearTimeout(this.searchTimeout);

        this.inputRef.current.value = '';
        this.inputRef.current.focus();

        if (tag) {
            this.addTag(tag, () => {
                this.setState({
                    autosuggestIsOpen: false
                });
            });
        }
    }

    addTag(tag, cb = () => {}) {

        clearTimeout(this.searchTimeout);

        if (tag) {
            this.setState({
                autosuggestIsOpen: false,
                tags: [...this.state.tags, tag]
            }, cb);
        }
    }

    removeLastTag() {
        this.setState({
            tags: this.state.tags.slice(0,-1)
        });
    }

    autosuggest(search) {
        if (search.length > 1) {
            // Load the data from the backend (with id as param)
            api.execute.get(this.props.path, this.props.id,'autosuggest', {search}).then(response => {
                this.setState({
                    autosuggestIsOpen: true,
                    autosuggest: response.data
                });
            });
        }
    }

    render() {

        let autosuggest;

        if (this.state.autosuggestIsOpen && this.state.autosuggest.length) {
            autosuggest = (
                <div className="tags-field__autosuggest">
                    {this.state.autosuggest.map((suggestion, i) => {
                        return (
                            <div className={'tags-field__autosuggestion'} key={i} onClick={e => this.handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <Field name={this.props.name} required={this.props.showRequiredIndicator} label={this.props.label} errors={this.props.errors}>
                <div className="tags-field">
                    <div className="tags-field__wrap">
                        <div className="tags-field__tags">
                            <Tags tags={this.state.tags} />
                        </div>
                        <div className="tags-field__input">
                            <input className={'tags-field__input-field'}
                                   ref={this.inputRef}
                                   onChange={this.handleChange.bind(this)}
                                   onKeyUp={this.handleKeyUp.bind(this)}
                                   onKeyDown={this.handleKeyDown.bind(this)}
                                   onBlur={this.handleBlur.bind(this)}
                            />
                        </div>
                        {autosuggest}
                    </div>
                </div>
            </Field>
        );
    }
}
