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

class BelongsToField extends Component
{
    use HasName;
    use HasLabel;
    use HasItemGrammar;
    use BuildsQuery;

    /**
     * @var string $titleColumn
     */
    private $titleColumn;

    /**
     * @var bool $isNullable
     */
    private $isNullable;

    /**
     * @var string $meta
     */
    private $meta;

    /**
     * @var array $createComponents
     */
    private $createComponents;

    /**
     * @var string $model
     */
    private $model;

    /**
     * BelongsToField constructor.
     * @param string $name
     * @param string|null $meta
     */
    public function __construct(string $name, string $meta = null)
    {
        $this->name($name);
        $this->label(Str::labelify($name));

        $this->meta = $meta ?: RelationshipMetaGuesser::getMeta($this->getName());
        $this->model = $this->meta::getModel();

        $this->singular($this->meta::getSingular());
        $this->plural($this->meta::getPlural());

        $this->titleColumn($this->meta::getTitleColumn());
        $this->create($this->meta::create());
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'belongs-to-field';
    }

    /**
     * @return $this
     */
    public function nullable()
    {
        $this->isNullable = true;
        $this->export('nullable', $this->isNullable);
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
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
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
     * @param Request $request
     */
    public function save(Model $model, Request $request)
    {
        $relation = $model->{$this->getName()}();

        if ($request->input($this->getName())) {

            $id = $request->input($this->getName());
            $relatedModel = $this->model::findOrFail($id);
            $relation->associate($relatedModel);

            return;
        }

        if ($this->isNullable) {
            $relation->dissociate();
        }
    }
}
