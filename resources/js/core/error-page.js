import React from 'react';
import Page from "./page";
import TextBlock from "./ui/text-block";

class ErrorPage extends React.Component {

    static defaultProps = {
        title: 'CMF',
        errorTitle: 'An error occurred',
        errorText: 'An unknown error occurred.',
    };

    render() {
        return (
            <Page title={this.props.title}>
                <TextBlock title={this.props.errorTitle} text={this.props.errorText} />
            </Page>
        );
    }
}

export default ErrorPage;
