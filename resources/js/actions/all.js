import Index from "./index";
import TreeIndex from "./tree-index";
import Edit from "./edit";
import Create from "./create";
import Delete from "./delete";
import View from "./view";
import Export from "./export";
import CustomController from "./custom-controller";
import CreateWizard from "./create-wizard";
import ViewMediaDirectory from "./view-media-directory";
import Dashboard from "./dashboard";
import SelectOne from "./select-one";
import BulkDelete from "./bulk-delete";

export default {
    'bulk-delete': BulkDelete,
    'index': Index,
    'tree-index': TreeIndex,
    'edit': Edit,
    'create': Create,
    'create-wizard': CreateWizard,
    'delete': Delete,
    'view': View,
    'dashboard': Dashboard,
    'export': Export,
    'custom-controller': CustomController,
    'view-media-directory': ViewMediaDirectory,
    'select-one': SelectOne
};
