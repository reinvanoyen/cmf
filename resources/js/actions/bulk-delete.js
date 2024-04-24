import React, {useState} from 'react';
import api from "../api/api";
import path from "../state/path";
import ui from "../core/ui/util";
import Button from "../core/ui/button";
import i18n from "../util/i18n";

function BulkDelete(props) {

    const [state, setState] = useState({
        options: [],
        selectedOptionId: null,
    });

    const ids = `${props.path.params.id}`;

    const bulkDelete = async () => {
        // Load the data from the backend (with id as param)
        await api.execute.get(props.path, props.id,'delete', {
            ids: ids.split(',').map(id => parseInt(id)),
        });
        // Redirect
        redirect();
        // Notify the user
        ui.notify('Deleted all items');
    }

    const redirect = () => {
        path.handleRedirect(props);
    }

    return (
        <div className="delete">
            <div className="delete__text">
                Are you sure you wish to delete these {props.plural}?
            </div>
            <div className="delete__footer">
                <div className="delete__confirm">
                    <Button onClick={e => bulkDelete()} text={i18n.get('snippets.delete_singular_confirm', {singular: props.plural})}/>
                </div>
                <div className="delete__cancel">
                    <Button onClick={redirect} text={i18n.get('snippets.delete_singular_cancel')} style={'secondary'}/>
                </div>
            </div>
        </div>
    );
}

BulkDelete.defaultProps = {
    type: '',
    components: [],
    path: {},
    id: 0,
    data: {},
    params: null,
    redirect: 'index',
    redirectBack: false,
    singular: '',
    plural: ''
};

export default BulkDelete;
