<?php

namespace ReinVanOyen\Cmf\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Traits\HasLabel;
use Spatie\Tags\Tag;

class TagFilter extends Filter
{
    use HasLabel;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'tag-filter';
    }

    /**
     * @param Request $request
     * @return \Illuminate\Database\Eloquent\Collection|Tag[]
     */
    public function apiLoad(Request $request)
    {
        $tags = Tag::all();

        return $tags->map(function ($tag) {
            return [
                'id' => $tag->id,
                'name' => $tag->name,
            ];
        });
    }

    /**
     * @param Request $request
     * @param $query
     */
    public function apply(Request $request, $query)
    {
        $filterName = 'filter_'.$this->getId();

        if ($request->has($filterName) && $request->input($filterName) !== null) {

            $tagIds = explode(',', $request->input($filterName));

            foreach ($tagIds as $tagId) {
                $query->whereHas('tags', function (Builder $query) use ($tagId) {
                        $query->where('tags.id', $tagId);
                });
            }
        }
    }
}
