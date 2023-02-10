import React from 'react';
import Button from "./ui/button";
import api from "../api/api";
import Icon from "./ui/icon";
import Dropdown from "./ui/dropdown";
import i18n from "../util/i18n";
import { useDispatch, useSelector } from "react-redux";
import ui from "./ui/util";

export default function UserPanel(props) {

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const logout = async () => {
        await api.auth.logout();

        dispatch({ type: 'auth/loggedout' });

        // Notify the user
        ui.notify('User logged out');
    };

    return (
        <div className="user-panel">
            <div className="user-panel__avatar">
                <Icon name={'person'} />
            </div>
            <div className="user-panel__name">
                {user.name}
            </div>
            <div className="user-panel__actions">
                <Dropdown style={['secondary']} text={i18n.get('snippets.logout')}>
                    <Button onClick={logout} style={'full'} text={i18n.get('snippets.logout_confirm')} />
                </Dropdown>
            </div>
        </div>
    );
};
