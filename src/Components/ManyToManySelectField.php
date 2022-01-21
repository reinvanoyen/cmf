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
use ReinVanOyen\Cmf\Traits\HasTooltip;
use ReinVanOyen\Cmf\Traits\HasValidation;

class ManyToManySelectField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;
    use HasItemGrammar;
    use HasTooltip;
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
     * @var array $createComponents
     */
    private $createComponents;

    /**
     * @var string $model
     */
    private $model;

    /**
     * ManyToManySelectField constructor.
     * @param string $name
     * @param string|null $meta
     */
    public function __construct(string $name, string $meta = null)
    {
        $this->name($name);
        $this->label(Str::labelify($name));

        $this->meta = $meta ?: RelationshipMetaGuesser::getMeta($this->getName());

        $this->singular($this->meta::getSingular());
        $this->plural($this->meta::getPlural());
        $this->model = $this->meta::getModel();
        $this->titleColumn($this->meta::getTitleColumn());
        $this->create($this->meta::create());

        foreach ($this->meta::getSorting() as $column => $method) {
            $this->orderBy($column, $method);
        }
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'many-to-many-select-field';
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
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
    }

    /**
     * @param Request $request
     * @return string
     */
    public function apiCreate(Request $request)
    {
        $modelClass = $this->model;

        // Validate
        $validationRules = [];
        foreach ($this->createComponents as $component) {
            $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
        }

        $request->validate($validationRules);

        // Create a new item
        $model = new $modelClass();

        // Save every component to the model
        foreach ($this->createComponents as $component) {
            $component->save($model, $request);
        }

        $model->save();

        ModelResource::provision($this->createComponents);

        return new ModelResource($model);
    }

    /**
     * @param $create
     * @return $this
     */
    public function create($create)
    {
        if (! $create) {
            $this->export('create', false);
            $this->export('createComponents', []);
        } else {
            $this->export('create', true);
            $this->createComponents = $create;
            $this->export('createComponents', $create);
        }

        return $this;
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
        ModelResource::fields([$this->titleColumn,]);

        return ModelResource::collection(
            $this->getResults($request)
        );
    }
}
