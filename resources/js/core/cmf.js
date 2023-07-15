import React, { useEffect, useState } from 'react';
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
import i18n from "../util/i18n";
import FooterText from "./footer-text";
import { useDispatch, useSelector } from "react-redux";
import useOnMount from "../hooks/use-on-mount";

export default function Cmf(props) {

    const [state, setState] = useState({
        isAuthenticating: true,
        isLoading: true,
        isError: false,
        isNavOpen: false,
        module: null,
        action: null
    });

    const { isLoggedIn } = useSelector(state => state.auth);
    const { title } = useSelector(state => state.cmf);
    const allModules = useSelector(state => state.modules.all);
    const primaryModules = useSelector(state => state.modules.primary);
    const location = useSelector(state => state.location.current);
    const prevLocation = useSelector(state => state.location.previous);
    const dispatch = useDispatch();

    const checkIfUserAuth = async () => {
        try {
            const response = await api.auth.user();
            onAuthSuccess(response.data.data);
        } catch (error) {
            setState({
                ...state,
                isAuthenticating: false
            });
        }
    }

    useOnMount(() => {
        checkIfUserAuth();
    });

    useEffect(() => {
        if (
            location.module !== prevLocation.module ||
            location.action !== prevLocation.action ||
            ! helpers.shallowEqual(location.params, prevLocation.params)
        ) {

            let currModule = null;

            for (let i = 0; i < allModules.length; i++) {

                if (allModules[i].id === location.module) {
                    currModule = allModules[i];
                    break;
                }

                for (let j = 0; j < allModules[i].submodules.length; j++) {
                    if (allModules[i].submodules[j].id === location.module) {
                        currModule = allModules[i].submodules[j];
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
    }, [location]);

    useEffect(() => {
        if (primaryModules.length) {
            bindPopState();
            goToRequestedModule();
        }
    }, [primaryModules]);

    useEffect(() => {
        if (isLoggedIn) {
            // Load all modules from the API
            api.modules.index().then(response => {
                dispatch({type: 'modules/update', payload: response.data.data});
            });
        }
    }, [isLoggedIn]);

    const setLoadingState = () => {
        setState({
            ...state,
            isLoading: true
        });
    }

    const onAuthSuccess = (user) => {
        dispatch({type: 'auth/loggedin', payload: user});
        setState({
            ...state,
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
        let module = controller.module || primaryModules[0].id;
        let action = controller.action || 'index';
        let params = controller.params;

        path.update(module, action, params);
    }

    const goToIndex = () => {
        // Go to the first module's index
        path.goTo(primaryModules[0].id, 'index');
    }

    const render = () => {

        if (state.isAuthenticating) {
            return <Loader />;
        }

        if (! isLoggedIn) {
            return <Login onSuccess={onLoginSuccess} onFail={onLoginFail} />;
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
                        <Logo name={title} />
                    </button>
                    <div className="cmf__user">
                        <UserPanel />
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
                            <FooterText />
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
