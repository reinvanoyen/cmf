import React, { useRef } from 'react';
import { useSelector } from "react-redux";

import api from "../../api/api";
import i18n from "../../util/i18n";

import Form from "../ui/form";
import TextField from "../../components/text-field";
import Page from "../page";

function Login(props) {

    const formRef = useRef();
    const { title } = useSelector(state => state.cmf);

    const loginAttempt = (data) => {
        api.auth.login(data.email, data.password).then(response => {
            props.onSuccess(response.data.data);
        }, error => {
            formRef.current.ready();
            props.onFail();
        });
    };

    return (
        <Page title={title}>
            <div className="login">
                <Form
                    ref={formRef}
                    onSubmit={loginAttempt}
                    submitButtonText={i18n.get('snippets.login')}
                >
                    <TextField name="email" label={i18n.get('snippets.email_address')} />
                    <TextField name="password" label={i18n.get('snippets.password')} htmlType={'password'} />
                </Form>
            </div>
        </Page>
    );
}

Login.defaultProps = {
    title: 'CMF',
    onSuccess: user => {},
    onFail: () => {}
};

export default Login;
