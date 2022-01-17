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
        $this->titleColumn($this->meta::getTitleColumn());

        $this->components(count($components) ? $components : $this->meta::index());

        if (count($this->meta::getSearchColumns())) {
            $this->search($this->meta::getSearchColumns());
        }

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
     */
    public function components(array $components)
    {
        $this->components = $components;

        /*
        foreach ($this->components as $component) {
            $component->resolve($this);
        }*/

        $this->export('components', $this->components);
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        if ($request->has($this->getName())) {

            $items = $request->get($this->getName());
            $itemIds = ($items ? explode(',', $items) : []);

            $model::saved(function ($model) use ($itemIds) {
                $model->{$this->getName()}()->sync($itemIds);
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
