<?php

namespace ReinVanOyen\Cmf\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TreeModelResource extends JsonResource
{
    /**
     * @var array $textColumn
     */
    private static $textColumn;

    /**
     * @var array $parentRelation
     */
    private static $parentRelation;

    /**
     * @param string $textColumn
     * @return void
     */
    public static function textColumn(string $textColumn)
    {
        self::$textColumn = $textColumn;
    }

    /**
     * @param string $textColumn
     * @return void
     */
    public static function parentRelation(string $parentRelation)
    {
        self::$parentRelation = $parentRelation;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $parentRelation = $this->{self::$parentRelation};

        return [
            'id' => $this->id,
            'text' => $this->{self::$textColumn},
            'parent' => $parentRelation ? $parentRelation->id : null,
            'droppable' => true,
        ];
    }
}
