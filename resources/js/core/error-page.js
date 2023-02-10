import React from "react";

import Page from './page';
import TextBlock from './ui/text-block';

function ErrorPage(props) {
    return (
        <Page title={props.title}>
            <TextBlock title={props.errorTitle} text={props.errorText} />
        </Page>
    );
}

ErrorPage.defaultProps = {
    title: 'CMF',
    errorTitle: 'An error occurred',
    errorText: 'An unknown error occurred.'
};

export default ErrorPage;
