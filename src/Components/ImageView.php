<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

class ImageView extends Component
{
    use HasLabel;
    use HasName;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'image-view';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->getFirstMediaUrl($this->getName());
    }
}
