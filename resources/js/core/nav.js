import React from 'react';
import path from "../state/path";
import Icon from "./ui/icon";
import ContextMenu from "./ui/context-menu";

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

    render() {
        return (
            <div className="nav">
                <div>
                    {this.props.modules.map(module => {

                        if (! module.inNavigation) {
                            return null;
                        }

                        return (
                            <ContextMenu
                                key={module.id}
                                links={[
                                    ['Open', 'open'],
                                    ['Open in new window', 'open_new']
                                ]}
                                onClick={path => this.onContextMenuClick(path, module)}
                            >
                                <div
                                    className={'nav__item'+(this.props.activeModule && this.props.activeModule.id === module.id ? ' nav__item--active' : '')}
                                    onClick={e => this.switchModule(module)}
                                >
                                    <span className="nav__icon">
                                        <Icon name={module.icon} />
                                    </span>
                                    <span className="nav__text">
                                        {module.title}
                                    </span>
                                </div>
                            </ContextMenu>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Nav;
