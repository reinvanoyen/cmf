import React from "react";
import { useSelector } from "react-redux";
import File from "../file";
import ContextMenu from "../context-menu";

function FileList(props) {

    const { viewMode } = useSelector(state => state.media);

    return (
        <div className={'file-list file-list--'+viewMode}>
            {props.files.map((file, i) => {
                return (
                    <div className="file-list__item" key={i}>
                        <ContextMenu
                            key={i}
                            links={props.contextMenuLinks}
                            onClick={path => props.onContextClick(path, file)}
                        >
                            <File
                                file={file}
                                fileLabels={props.fileLabels}
                                isSelected={props.selection.includes(file.id)}
                                selectionMode={props.selectionMode}
                                onClick={(e, file) => props.onClick(e, file)}
                            />
                        </ContextMenu>
                    </div>
                );
            })}
        </div>
    );
}

FileList.defaultProps = {
    files: [],
    selection: [],
    fileLabels: {},
    selectionMode: false,
    contextMenuLinks: [],
    onClick: (e, file) => {},
    onContextClick: (path, file) => {},
};

export default FileList;
