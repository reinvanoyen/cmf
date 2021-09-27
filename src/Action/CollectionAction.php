<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use ReinVanOyen\Cmf\Http\Resources\ModelCollection;
use ReinVanOyen\Cmf\Traits\BuildsQuery;

/**
 * Class CollectionAction
 * @package ReinVanOyen\Cmf\Action
 */
abstract class CollectionAction extends Action
{
    use BuildsQuery;

    /**
     * @var array $components
     */
    protected $components;

    /**
     * @var string $plurel
     */
    private $plural;

    /**
     * @var string $plural
     */
    private $singular;

    /**
     * CollectionAction constructor.
     * @param string $model
     */
    public function __construct(string $model)
    {
        $this->model = $model;
        $modelName = class_basename($model);
        $this->plural(Str::plural($modelName));
        $this->singular(Str::singular($modelName));
    }

    /**
     * @param string $plural
     * @return $this
     */
    public function plural(string $plural)
    {
        $this->plural = $plural;
        $this->export('plural', $plural);
        return $this;
    }

    /**
     * @param string $singular
     * @return $this
     */
    public function singular(string $singular)
    {
        $this->singular = $singular;
        $this->export('singular', $singular);
        return $this;
    }

    /**
     * @param Request $request
     * @return ModelCollection
     */
    public function load(Request $request)
    {
        ModelCollection::provision($this->components);

        return new ModelCollection($this->getResults($request));
    }
}
