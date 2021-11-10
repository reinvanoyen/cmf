<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\BuildsQuery;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

class BelongsToView extends Component
{
    use HasName;
    use HasLabel;
    use BuildsQuery;

    /**
     * @var string $titleColumn
     */
    private $titleColumn;

    /**
     * BelongsToView constructor.
     * @param string $name
     * @param string|null $meta
     */
    public function __construct(string $name, string $meta = null)
    {
        $this->name($name);
        $this->label(Str::labelify($name));

        $meta = $meta ?: RelationshipMetaGuesser::getMeta($name);
        $this->titleColumn($meta::getTitleColumn());
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'belongs-to-view';
    }

    /**
     * @param string $field
     * @return $this
     */
    public function titleColumn(string $field)
    {
        $this->titleColumn = $field;
        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $foreign = $model->{$this->getName()};
        $attributes[$this->getName()] = ($foreign ? $foreign->{$this->titleColumn} : null);
    }
}
