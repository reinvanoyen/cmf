import React from 'react';
import Button from "./ui/button";
import api from "../api/api";
import Icon from "./ui/icon";
import Dropdown from "./ui/dropdown";

class UserPanel extends React.Component {

    static defaultProps = {
        user: {
            id: 0,
            name: '',
            email: ''
        },
        onLogout: () => {}
    };

    logout() {
        api.auth.logout().then(response => {
            this.props.onLogout();
        }, error => {
            //
        });
    }

    render() {
        return (
            <div className="user-panel">
                <div className="user-panel__avatar">
                    <Icon name={'person'} />
                </div>
                <div className="user-panel__name">
                    {this.props.user.name}
                </div>
                <div className="user-panel__actions">
                    <Dropdown text={'Logout'}>
                        <Button onClick={this.logout.bind(this)} style={'full'} text={'Yes, log me out.'} />
                    </Dropdown>
                </div>
            </div>
        );
    }
}

export default UserPanel;
