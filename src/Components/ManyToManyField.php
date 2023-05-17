<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\BuildsQuery;
use ReinVanOyen\Cmf\Traits\HasItemGrammar;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasValidation;

class ManyToManyField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;
    use HasItemGrammar;
    use BuildsQuery;

    /**
     * @var string|null $meta
     */
    private $meta;

    /**
     * @var string $titleColumn
     */
    private $titleColumn;

    /**
     * @var string $model
     */
    private $model;

    /**
     * @var array $components
     */
    private $components;

    /**
     * @var array $pivotComponents
     */
    private $pivotComponents;

    /**
     * ManyToManyField constructor.
     * @param string $name
     * @param string|null $meta
     * @param array $components
     */
    public function __construct(string $name, string $meta = null, array $components = [])
    {
        $this->name($name);
        $this->label(Str::labelify($name));

        $this->meta = $meta ?: RelationshipMetaGuesser::getMeta($this->getName());

        $this->singular($this->meta::getSingular());
        $this->plural($this->meta::getPlural());
        $this->model = $this->meta::getModel();

        $this->grid($this->meta::getIndexGrid());
        $this->titleColumn($this->meta::getTitleColumn());

        $this->components(count($components) ? $components : $this->meta::index());

        if (count($this->meta::getSearchColumns())) {
            $this->search($this->meta::getSearchColumns());
        }

        $this->paginate($this->meta::getPerPage());

        foreach ($this->meta::getSorting() as $column => $method) {
            $this->orderBy($column, $method);
        }
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'many-to-many-field';
    }

    /**
     * @param array $grid
     * @return $this
     */
    public function grid(array $grid)
    {
        $this->export('grid', $grid);
        return $this;
    }

    /**
     * @param string $column
     * @return $this
     */
    public function titleColumn(string $column)
    {
        $this->titleColumn = $column;
        $this->export('titleColumn', $this->titleColumn);
        return $this;
    }

    /**
     * @param array $components
     * @return $this
     */
    public function pivot(array $components)
    {
        $this->pivotComponents = $components;
        $this->export('pivotComponents', $this->pivotComponents);
        return $this;
    }

    /**
     * @param array $components
     * @return $this
     */
    public function components(array $components)
    {
        $this->components = $components;
        /*
        foreach ($this->components as $component) {
            $component->resolve($this);
        }*/
        $this->export('components', $this->components);
        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        if (empty($this->pivotComponents)) {
            $attributes[$this->getName()] = $model->{$this->getName()};
            return;
        }

        // Provision the pivotComponents
        $pivotAttributes = [];
        foreach ($this->pivotComponents as $component) {
            $component->provision($model, $pivotAttributes);
        }

        $attributes[$this->getName()] = $model->{$this->getName()}()->withPivot(array_keys($pivotAttributes))->get();
    }

    /**
     * @param Model $model
     * @param Request $request
     * @return void
     */
    public function save(Model $model, Request $request)
    {
        if ($request->has($this->getName())) {

            $payload = json_decode($request->input($this->getName()), true);

            $itemIds = ($payload['ids'] ?: []);
            $pivotData = ($payload['pivot'] ?: []);

            $model::saved(function ($model) use ($itemIds, $pivotData) {

                // Sync the ids
                $model->{$this->getName()}()->sync($pivotData);
            });
        }
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function apiLoad(Request $request)
    {
        ModelResource::provision($this->components);
        ModelResource::fields([$this->titleColumn,]);

        return ModelResource::collection(
            $this->getResults($request)
        );
    }
}
