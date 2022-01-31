<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\MediaFileResource;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

/**
 * Class Thumb
 * @package ReinVanOyen\Cmf\Components
 */
class Thumb extends Component
{
    use HasLabel;
    use HasName;

    /**
     * Thumb constructor.
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->name($name);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'thumb';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = new MediaFileResource($model->{$this->getName()});
    }
}
