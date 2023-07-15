import React from "react";
import ContextMenu from "./ui/context-menu";
import NavItem from "./nav-item";
import SubnavItem from "./subnav-item";
import i18n from "../util/i18n";
import { useSelector } from "react-redux";
import path from "../state/path";

export default function Nav(props) {

    const primaryModules = useSelector(state => state.modules.primary);

    const switchModule = (module) => {

        if (props.onModuleSwitch) {
            props.onModuleSwitch();
        }

        path.goTo(module.id, 'index');
    };

    const onContextMenuClick = (path, module) => {
        if (path === 'open') {
            switchModule(module);
        } else if (path === 'open_new') {
            window.open(module.url);
        }
    }

    const isModuleActive = (module) => {
        if (props.activeModule && props.activeModule.id === module.id) {
            return true;
        }

        for (let i = 0; i < module.submodules.length; i++) {
            if (props.activeModule && props.activeModule.id === module.submodules[i].id) {
                return true;
            }
        }

        return false;
    }

    const renderSubmodules = (module) => {

        if (! module.submodules.length) {
            return null;
        }

        return (
            <div className={'nav__subnav'+(isModuleActive(module) ? ' nav__subnav--open' : '')}>
                {module.submodules.map(module => {
                    return (
                        <ContextMenu
                            key={module.id}
                            links={[
                                [i18n.get('snippets.open'), 'open'],
                                [i18n.get('snippets.open_new_window'), 'open_new']
                            ]}
                            onClick={path => onContextMenuClick(path, module)}
                        >
                            <SubnavItem module={module} onClick={() => switchModule(module)} isActive={(props.activeModule && props.activeModule.id === module.id)} />
                        </ContextMenu>
                    );
                })}
            </div>
        );
    }

    const render = () => {
        return (
            <div className="nav">
                <div>
                    {primaryModules.map(module => {
                        return (
                            <React.Fragment key={module.id}>
                                <ContextMenu
                                    links={[
                                        [i18n.get('snippets.open'), 'open'],
                                        [i18n.get('snippets.open_new_window'), 'open_new']
                                    ]}
                                    onClick={path => onContextMenuClick(path, module)}
                                >
                                    <NavItem module={module} onClick={() => switchModule(module)} isActive={isModuleActive(module)} />
                                </ContextMenu>
                                {renderSubmodules(module)}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        );
    }

    return render();
}
