<?php

namespace ReinVanOyen\Cmf\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class TreeModelCollection extends ResourceCollection
{
    /**
     * @param string $textColumn
     * @return void
     */
    public static function textColumn(string $textColumn)
    {
        TreeModelResource::textColumn($textColumn);
    }

    /**
     * @param string $parentRelation
     * @return void
     */
    public static function parentRelation(string $parentRelation)
    {
        TreeModelResource::parentRelation($parentRelation);
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'data' => TreeModelResource::collection($this->collection),
        ];
    }
}
