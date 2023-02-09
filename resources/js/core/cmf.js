import React, {useEffect, useState} from 'react';
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
import Icon from "./ui/icon";
import ErrorModule from "./module/error-module";
import meta from "../util/meta";
import i18n from "../util/i18n";
import FooterText from "./footer-text";
import useForceUpdate from "../hooks/use-force-update";
import { useDispatch, useSelector } from "react-redux";

export default function Cmf(props) {

    const [state, setState] = useState({
        tick: 0,
        isAuthenticating: true,
        isLoading: true,
        isLoggedIn: false,
        isError: false,
        isNavOpen: false,
        module: null,
        action: null
    });

    const { user } = useSelector(state => state.auth);
    const modules = useSelector(state => state.modules.modules);
    const location = useSelector(state => state.location.current);
    const prevLocation = useSelector(state => state.location.previous);
    const dispatch = useDispatch();
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        api.auth.user().then(response => {
            onAuthSuccess(response.data.data);
        }, error => {
            setState({
                ...state,
                isAuthenticating: false
            });
        });
    }, []);

    useEffect(() => {
        if (
            location.module !== prevLocation.module ||
            location.action !== prevLocation.action ||
            ! helpers.shallowEqual(location.params, prevLocation.params)
        ) {

            let currModule = null;

            for (let i = 0; i < modules.length; i++) {

                if (modules[i].id === location.module) {
                    currModule = modules[i];
                    break;
                }

                for (let j = 0; j < modules[i].submodules.length; j++) {
                    if (modules[i].submodules[j].id === location.module) {
                        currModule = modules[i].submodules[j];
                        break;
                    }
                }
            }

            api.modules.action(location, location.params).then(response => {

                helpers.scrollTop();

                setState({
                    ...state,
                    isLoading: false,
                    isError: false,
                    path: location,
                    module: currModule,
                    action: response.data.data
                });

            }).catch((error) => {

                setState({
                    ...state,
                    isLoading: false,
                    isError: true,
                    path: location
                });
            });
        }
    }, [location, prevLocation]);

    useEffect(() => {
        if (modules.length) {
            bindPopState();
            goToRequestedModule();
        }
    }, [modules]);

    useEffect(() => {
        if (state.isLoggedIn) {
            // Load all modules from the API
            api.modules.index().then(response => {
                dispatch({type: 'modules/update', payload: response.data.data});
            });
        }
    }, [state.isLoggedIn]);

    const setLoadingState = () => {
        setState({
            ...state,
            isLoading: true
        });
    }

    const getVersion = () => {
        return meta.get('cmf:version');
    }

    const onAuthSuccess = (user) => {
        dispatch({type: 'auth/loggedin', payload: user});
        setState({
            ...state,
            isLoggedIn: true,
            isAuthenticating: false
        });
    }

    const toggleNavigation = () => {
        setState({
            ...state,
            isNavOpen: ! state.isNavOpen
        });
        document.body.classList.toggle('open-nav');
    }

    const onLoginSuccess = (user) => {
        ui.notify(i18n.get('snippets.welcome_back', {name: user.name}));
        onAuthSuccess(user);
    }

    const onLoginFail = () => {
        ui.notify(i18n.get('snippets.login_failed'));
    }

    const bindPopState = () => {
        window.onpopstate = e => goToRequestedModule();
    }

    const goToRequestedModule = () => {

        // Get controller
        let controller = path.parseLocation(window.location);
        let module = controller.module || modules[0].id;
        let action = controller.action || 'index';
        let params = controller.params;

        dispatch({type: 'location/update', payload: {module, action, params}});
    }

    const goToIndex = () => {
        // Go to the first module's index
        dispatch({type: 'location/update', payload: {module: modules[0].id, action: 'index'}});
    }

    const onLogout = () => {
        setState({
            ...state,
            isLoggedIn: false
        });

        // Notify the user
        ui.notify('User logged out');
    }

    const getUserPanel = () => {
        return (
            <UserPanel onLogout={onLogout.bind(this)} />
        );
    }

    const render = () => {

        if (state.isAuthenticating) {
            return <Loader />;
        }

        if (! state.isLoggedIn) {
            return <Login title={props.title} onSuccess={onLoginSuccess} onFail={onLoginFail} />;
        }

        let renderModule = null;

        if (state.isError) {
            renderModule = <ErrorModule />;
        } else if (! state.isLoading) {
            renderModule = <Module {...state.module} action={state.action} path={state.path} key={state.module.id} />;
        }

        return (
            <div className="cmf">
                <div className="cmf__header">
                    <button className="cmf__logo" onClick={goToIndex}>
                        <Logo name={props.title} />
                    </button>
                    <div className="cmf__user">
                        {getUserPanel()}
                    </div>
                </div>
                <div className="cmf__main">
                    <div className="cmf__nav">
                        <Nav activeModule={state.module} />
                    </div>
                    <div className="cmf__content">
                        <div className="cmf__module">
                            {renderModule}
                        </div>
                        <div className="cmf__footer">
                            <FooterText title={props.title} />
                        </div>
                    </div>
                </div>
                <button className="cmf__nav-trigger" onClick={toggleNavigation}>
                    <Icon style={'medium'} name={(state.isNavOpen ? 'close' : 'menu')} />
                </button>
            </div>
        );
    }

    return render();
}
