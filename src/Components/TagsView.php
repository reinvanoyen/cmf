<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use Spatie\Tags\Tag;

class TagsView extends Component
{
    /**
     * @return string
     */
    public function type(): string
    {
        return 'tags-view';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $tags = $model->tags()->get();
        $attributes[$this->getId().'_tags'] = $tags->map(function (Tag $tag) {
            return $tag->name;
        });
    }
}
