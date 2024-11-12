<?php

namespace ReinVanOyen\Cmf\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ModelResource extends JsonResource
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
     * @var array $aliases
     */
    private static $aliases = [];

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
     * @param array $aliases
     * @return void
     */
    public static function aliases(array $aliases)
    {
        self::$aliases = $aliases;
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
            if (isset(self::$aliases[$field])) {
                $attributes[self::$aliases[$field]] = $this->{$field};
            } else {
                $attributes[$field] = $this->{$field};
            }
        }

        return $attributes;
    }
}
