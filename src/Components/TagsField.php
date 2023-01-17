<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasTooltip;
use Spatie\Tags\Tag;

class TagsField extends Component
{
    use HasLabel;
    use HasTooltip;

    /**
     * TagsField constructor.
     */
    public function __construct()
    {
        $this->label(Str::labelify('Tags'));
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'tags-field';
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

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        $tags = json_decode($request->input($this->getId().'_tags'));

        $model::saved(function ($model) use ($tags) {
            $model->syncTags($tags);

            // @TODO remove this event, making it run only once (?)
        });
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function apiAutosuggest(Request $request)
    {
        $search = $request->input('search');
        $tags = Tag::containing($search)->get();

        return $tags->map(function (Tag $tag) {
            return $tag->name;
        });
    }

    /**
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Collection|Model[]|Collection|Tag[]
     */
    public function apiLoad(Request $request)
    {
        $tags = Tag::all();

        return $tags->map(function (Tag $tag) {
            return $tag->name;
        });
    }
}
