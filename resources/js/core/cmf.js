import React from 'react';
import Nav from "./nav";
import Module from "./module/module";
import api from "../api/api";
import Loader from "./ui/loader";
import path from "../state/path";
import Login from "./auth/login";
import UserPanel from "./user-panel";
import ui from "./ui/util";
import Logo from "./logo";
import helpers from "../util/helpers";

class Cmf extends React.Component {

    static defaultProps = {
        title: 'CMF'
    };

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticating: true,
            isLoading: true,
            isLoggedIn: false,
            user: {},
            modules: [],
            path: {},
            module: null,
            action: null
        };

        path.setCmf(this);
    }

    componentDidMount() {
        // Check if we're logged in
        api.auth.user().then(response => {

            // Looks like we're logged in
            let user = response.data.data;
            this.onAuthSuccess(user);
        }, error => {
            this.setState({
                isAuthenticating: false
            });
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (
            path.forceRefresh ||
            this.state.path.module !== path.currentPath.module ||
            this.state.path.action !== path.currentPath.action ||
            ! helpers.shallowEqual(this.state.path.params, path.currentPath.params)
        ) {

            let module = null;

            for (let i = 0; i < this.state.modules.length; i++) {
                if (this.state.modules[i].id === path.currentPath.module) {
                    module = this.state.modules[i];
                    break;
                }
                for (let j = 0; j < this.state.modules[i].submodules.length; j++) {
                    if (this.state.modules[i].submodules[j].id === path.currentPath.module) {
                        module = this.state.modules[i].submodules[j];
                        break;
                    }
                }
            }

            api.modules.action(path.currentPath, path.currentPath.params).then(response => {

                helpers.scrollTop();

                let action = response.data.data;

                this.setState({
                    isLoading: false,
                    path: path.currentPath,
                    module,
                    action
                });
            });
        }
    }

    setLoadingState() {
        this.setState({
            isLoading: true
        });
    }

    onAuthSuccess(user) {

        this.setState({
            isLoggedIn: true,
            isAuthenticating: false,
            user: user
        });

        // Load all modules from the API
        api.modules.index().then(response => {

            let modules = response.data.data;

            // Update the component with the modules
            this.setState({modules}, () => {
                this.bindPopState();
                this.goToRequestedModule();
            });
        });
    }

    onLoginSuccess(user) {
        ui.notify('Welcome back, '+user.name);
        this.onAuthSuccess(user);
    }

    onLoginFail() {
        ui.notify('User login failed');
    }

    bindPopState() {
        window.onpopstate = e => this.goToRequestedModule();
    }

    goToRequestedModule() {

        // Get controller
        let controller = path.parseLocation(window.location);
        let module = controller.module || this.state.modules[0].id;
        let action = controller.action || 'index';

        // Go to the first module's index
        path.update(module, action, controller.params);
    }

    goToIndex() {
        // Go to the first module's index
        path.goTo(this.state.modules[0].id, 'index');
    }

    onLogout() {
        this.setState({
            isLoggedIn: false
        });

        // Notify the user
        ui.notify('User logged out');
    }

    getLogin() {
        return (
            <Login
                title={this.props.title}
                onSuccess={this.onLoginSuccess.bind(this)}
                onFail={this.onLoginFail.bind(this)}
            />
        );
    }

    getUserPanel() {
        return (
            <UserPanel
                user={this.state.user}
                onLogout={this.onLogout.bind(this)}
            />
        );
    }

    render() {

        if (this.state.isAuthenticating) {
            return <Loader />;
        }

        if (! this.state.isLoggedIn) {
            return this.getLogin();
        }

        let module;

        if (! this.state.isLoading) {
            module = <Module {...this.state.module} action={this.state.action} path={this.state.path} key={this.state.module.id} />;
        }

        return (
            <div className="cmf">
                <div className="cmf__header">
                    <button className="cmf__logo" onClick={this.goToIndex.bind(this)}>
                        <Logo name={this.props.title} />
                    </button>
                    <div className="cmf__user">
                        {this.getUserPanel()}
                    </div>
                </div>
                <div className="cmf__main">
                    <div className="cmf__nav">
                        <Nav
                            modules={this.state.modules}
                            activeModule={this.state.module}
                        />
                    </div>
                    <div className="cmf__content">
                        <div className="cmf__module">
                            {module}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cmf;
