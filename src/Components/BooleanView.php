<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

class BooleanView extends Component
{
    use HasName;
    use HasLabel;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'boolean-view';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
    }
}
