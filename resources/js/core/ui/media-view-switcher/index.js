import React from "react";
import ButtonGroup from "../button-group";
import { useDispatch, useSelector } from "react-redux";
import localStorage from "../../../util/local-storage";

function MediaViewSwitcher() {

    const dispatch = useDispatch();
    const { viewMode } = useSelector(state => state.media);

    const switchViewMode = (mode) => {
        dispatch({ type: 'media/view/update', payload: mode });
        localStorage.set('media-view-mode', mode);
    };

    return (
        <ButtonGroup
            active={viewMode}
            buttons={[
                {icon: 'list', key: 'compact-list'},
                {icon: 'view_list', key: 'list'},
                {icon: 'grid_view', key: 'grid'},
            ]}
            onClick={switchViewMode}
        />
    );
}

export default MediaViewSwitcher;
