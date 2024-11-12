import './index.scss';
import React from "react";

function DragPlaceholder({text}) {
    return (
        <span className="drag-placeholder">{text}</span>
    );
}

export default DragPlaceholder;
