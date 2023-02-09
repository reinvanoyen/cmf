import React, { useRef } from 'react';
import Form from "../ui/form";
import TextField from "../../components/text-field";
import api from "../../api/api";
import Page from "../page";
import i18n from "../../util/i18n";

export default function Login(props) {

    /*
    static defaultProps = {
        title: 'CMF',
        onSuccess: user => {},
        onFail: () => {}
    };*/

    const formRef = useRef();

    const loginAttempt = (data) => {
        api.auth.login(data.email, data.password).then(response => {
            props.onSuccess(response.data.data);
        }, error => {
            formRef.current.ready();
            props.onFail();
        });
    };

    return (
        <Page title={props.title}>
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
