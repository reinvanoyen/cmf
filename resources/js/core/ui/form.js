import React from 'react';
import Button from "./button";

export default class Form extends React.Component {

    static defaultProps = {
        errors: {},
        submitButtonText: 'Submit',
        onSubmit: () => {}
    };

    constructor(props) {

        super(props);

        this.state = {
            isSubmitting: false
        };

        this.childRefs = [];

        if (this.hasMultipleChildren()) {
            this.props.children.forEach(() => {
                this.childRefs.push(React.createRef());
            });
        } else {
            this.childRefs.push(React.createRef());
        }
    }

    submit() {
        this.props.onSubmit(this.handleSubmit());
    }

    onSubmit(e) {

        e.preventDefault();

        if (! this.state.isSubmitting) {
            this.setState({
                isSubmitting: true
            });
            this.submit();
        }
    }


    ready() {
        this.setState({
            isSubmitting: false
        });
    }

    handleSubmit() {

        let data = {};

        if (this.hasMultipleChildren()) {
            this.props.children.forEach((child, i) => {
                this.childRefs[i].current.handleSubmit(data);
            });
            return data;
        }

        this.childRefs[0].current.handleSubmit(data);
        return data;
    }

    hasMultipleChildren() {
        return this.props.children.length;
    }

    renderChildren() {

        if (this.hasMultipleChildren()) {
            return this.props.children.map((child, i) => {
                const TagName = child.type;
                return (
                    <div key={i} className="form__input">
                        <TagName ref={this.childRefs[i]} {...child.props} errors={this.props.errors} />
                    </div>
                );
            });
        }

        const TagName = this.props.children.type;
        return (
            <div className="form__input">
                <TagName ref={this.childRefs[0]} {...this.props.children.props} />
            </div>
        );
    }

    render() {
        return (
            <form className={'form'+(this.state.isSubmitting ? ' form--submitting' : '')} onSubmit={e => this.onSubmit(e)}>
                <div className="form__inputs">
                    {this.renderChildren()}
                </div>
                <div className="form__footer">
                    <Button text={this.props.submitButtonText} type={'submit'} />
                </div>
            </form>
        );
    }
}
