import React from 'react';
import path from "../state/path";
import ContextMenu from "./ui/context-menu";
import NavItem from "./nav-item";
import SubnavItem from "./subnav-item";

class Nav extends React.Component {

    static defaultProps = {
        modules: [],
        activeModule: {},
        onModulesLoaded: () => {},
        onModuleSwitch: () => {}
    };

    switchModule(module) {
        this.props.onModuleSwitch();
        path.forceRefresh = true;
        path.goTo(module.id, 'index');
    }

    onContextMenuClick(path, module) {
        if (path === 'open') {
            this.switchModule(module);
        } else if (path === 'open_new') {
            window.open(module.url);
        }
    }

    isModuleActive(module) {
        if (this.props.activeModule && this.props.activeModule.id === module.id) {
            return true;
        }

        for (let i = 0; i < module.submodules.length; i++) {
            if (this.props.activeModule && this.props.activeModule.id === module.submodules[i].id) {
                return true;
            }
        }

        return false;
    }

    renderSubmodules(module) {

        if (! module.submodules.length) {
            return null;
        }

        return (
            <div className={'nav__subnav'+(this.isModuleActive(module) ? ' nav__subnav--open' : '')}>
                {module.submodules.map(module => {
                    return (
                        <ContextMenu
                            key={module.id}
                            links={[
                                ['Open', 'open'],
                                ['Open in new window', 'open_new']
                            ]}
                            onClick={path => this.onContextMenuClick(path, module)}
                        >
                            <SubnavItem module={module} onClick={() => this.switchModule(module)} isActive={(this.props.activeModule && this.props.activeModule.id === module.id)} />
                        </ContextMenu>
                    );
                })}
            </div>
        );
    }

    render() {
        return (
            <div className="nav">
                <div>
                    {this.props.modules.map(module => {

                        if (! module.inNavigation) {
                            return null;
                        }

                        return (
                            <React.Fragment key={module.id}>
                                <ContextMenu
                                    links={[
                                        ['Open', 'open'],
                                        ['Open in new window', 'open_new']
                                    ]}
                                    onClick={path => this.onContextMenuClick(path, module)}
                                >
                                    <NavItem module={module} onClick={() => this.switchModule(module)} isActive={this.isModuleActive(module)} />
                                </ContextMenu>
                                {this.renderSubmodules(module)}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Nav;
