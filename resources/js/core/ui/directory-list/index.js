import React from "react";
import { useSelector } from "react-redux";
import ContextMenu from "../context-menu";
import Directory from "../directory";

function DirectoryList(props) {

    const { viewMode } = useSelector(state => state.media);

    return (
        <div className={'file-list file-list--'+viewMode}>
            {props.directories.map((directory, i) => {
                return (
                    <div className="file-list__item" key={i}>
                        <ContextMenu
                            key={i}
                            links={props.contextMenuLinks}
                            onClick={path => props.onContextClick(path, directory)}
                        >
                            <Directory
                                directory={directory}
                                onClick={(e, directory) => props.onClick(e, directory)}
                            />
                        </ContextMenu>
                    </div>
                );
            })}
        </div>
    );
}

DirectoryList.defaultProps = {
    directories: [],
    contextMenuLinks: [],
    onClick: (e, directory) => {},
    onContextClick: (path, directory) => {},
};

export default DirectoryList;
