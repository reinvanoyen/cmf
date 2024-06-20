import React from 'react';
import Button from "./ui/button";
import api from "../api/api";
import Icon from "./ui/icon";
import Dropdown from "./ui/dropdown";
import i18n from "../util/i18n";
import { useDispatch, useSelector } from "react-redux";
import ui from "./ui/util";
import LinkList from "./ui/link-list";
import path from "../state/path";
import util from "./ui/util";
import gravatar from "../util/gravatar";

export default function UserPanel(props) {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const secondaryModules = useSelector(state => state.modules.secondary);

    const logout = async () => {

        util.confirm({
            title: i18n.get('snippets.logout'),
            confirmButtonText: i18n.get('snippets.logout_confirm'),
            confirm: async () => {

                await api.auth.logout();
                dispatch({ type: 'auth/loggedout' });
                // Notify the user
                ui.notify('User logged out');
            }
        });
    };

    const switchModule = (moduleId) => {
        path.goTo(moduleId, 'index');
    };

    return (
        <div className="user-panel">
            <div className="user-panel__avatar">
                <img src={gravatar.get(user.email)} alt={user.name} />
            </div>
            <div className="user-panel__name">
                {user.name}
            </div>
            <div className="user-panel__actions">
                <Dropdown style={['secondary']} stopPropagation={false}>
                    <LinkList stopPropagation={false} links={secondaryModules.map(value => [value.title, value.id])} onClick={id => switchModule(id)} />
                    <div className="user-panel__logout">
                        <Button stopPropagation={false} onClick={logout} style={['full', 'small']} text={i18n.get('snippets.logout')} />
                    </div>
                </Dropdown>
            </div>
        </div>
    );
};
