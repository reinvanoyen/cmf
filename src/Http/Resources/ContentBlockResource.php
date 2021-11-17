<?php

namespace ReinVanOyen\Cmf\Http\Resources;

class ForeignModelResource extends ModelResource
{
    /**
     * @var array $components
     */
    private static $components = [];

    /**
     * @var array $fields
     */
    private static $fields = [];

    /**
     * @param array $components
     */
    public static function provision(array $components)
    {
        self::$components = $components;
    }

    /**
     * @param array $fields
     */
    public static function fields(array $fields)
    {
        self::$fields = $fields;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $attributes = [
            'id' => $this->id,
        ];

        // Provision the API with the needed data from the components
        foreach (self::$components as $component) {
            $component->provision($this, $attributes);
        }

        foreach (self::$fields as $field) {
            $attributes[$field] = $this->{$field};
        }

        dd($attributes);

        return $attributes;
    }
}
