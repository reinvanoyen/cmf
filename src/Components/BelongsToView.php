<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
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
     * @var string $titleField
     */
    private $titleField;

    /**
     * BelongsToField constructor.
     * @param string $name
     * @param string $model
     */
    public function __construct(string $name)
    {
        $this->name($name);
        $this->label(Str::labelify($name));
        $this->titleField('title');
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
    public function titleField(string $field)
    {
        $this->titleField = $field;
        $this->export('titleField', $this->titleField);
        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $foreign = $model->{$this->getName()};
        $attributes[$this->getName()] = ($foreign ? $foreign->{$this->titleField} : null);
    }
}
