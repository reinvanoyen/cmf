import EnumFilter from "./enum-filter";
import BelongsToFilter from "./belongs-to-filter";
import TagFilter from "./tag-filter";
import BooleanFilter from "./boolean-filter";
import QueryFilter from "./query-filter";

export default {
    'enum-filter': EnumFilter,
    'query-filter': QueryFilter,
    'belongs-to-filter': BelongsToFilter,
    'boolean-filter': BooleanFilter,
    'tag-filter': TagFilter
};
