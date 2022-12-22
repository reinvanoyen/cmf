import React from 'react';
import Form from "../ui/form";
import TextField from "../../components/text-field";
import api from "../../api/api";
import Page from "../page";
import i18n from "../../util/i18n";

class Login extends React.Component {

    static defaultProps = {
        title: 'CMF',
        onSuccess: user => {},
        onFail: () => {}
    };

    constructor(props) {
        super(props);

        this.formRef = React.createRef();
    }

    loginAttempt(data) {
        api.auth.login(data.email, data.password).then(response => {
            this.props.onSuccess(response.data.data);
        }, error => {
            this.formRef.current.ready();
            this.props.onFail();
        });
    }

    render() {
        return (
            <Page title={this.props.title}>
                <div className="login">
                    <Form
                        ref={this.formRef}
                        onSubmit={this.loginAttempt.bind(this)}
                        submitButtonText={i18n.get('snippets.login')}
                    >
                        <TextField name="email" label={i18n.get('snippets.email_address')} />
                        <TextField name="password" label={i18n.get('snippets.password')} htmlType={'password'} />
                    </Form>
                </div>
            </Page>
        );
    }
}

export default Login;
