<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ContentBlockResource;
use ReinVanOyen\Cmf\Http\Resources\ModelCollection;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\BuildsQuery;
use ReinVanOyen\Cmf\Traits\HasItemGrammar;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasValidation;

class HasManyField extends Component
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

        $this->components(count($components) ? $components : $this->meta::create());

        foreach ($this->meta::getSorting() as $column => $method) {
            $this->orderBy($column, $method);
        }
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'has-many-field';
    }

    /**
     * @param array $components
     * @return $this
     */
    public function components(array $components)
    {
        $this->components = $components;
        $this->export('components', $this->components);
        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $foreignModels = $model->{$this->getName()};

        $payload = [];

        foreach ($foreignModels as $item) {

            $itemAttrs = [
                'id' => $item->id,
            ];

            foreach ($this->components as $component) {
                $component->provision(new ModelResource($item), $itemAttrs);
            }

            $payload[] = $itemAttrs;
        }

        $attributes[$this->getName()] = $payload;

        /*
        ModelResource::provision($this->components);

        foreach ($foreignModels as $foreignModel) {
            $collection[] = new ModelResource($foreignModel);
        }

        $attributes[$this->getName()] = $collection;
        */
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

            $deleteIds = ($payload['delete'] ?: []);
            $update = ($payload['update'] ?: []);
            $create = ($payload['create'] ?: []);

            $model::saved(function ($model) use ($deleteIds, $update, $create) {
                $this->deleteForeignItems($model, $deleteIds);
                $this->updateForeignItems($model, $update);
                $this->createForeignItems($model, $create);
            });
        }
    }

    private function deleteForeignItems(Model $model, array $ids = [])
    {
        foreach ($ids as $id) {
            $foreignModel = $model->{$this->getName()}()->where('id', $id)->first();
            $foreignModel?->delete();
        }
    }

    private function updateForeignItems(Model $model, array $rows)
    {
        foreach ($rows as $id => $attrs) {

            // Find the model by id
            $foreignModel = $model->{$this->getName()}()->where('id', $id)->first();

            // Create a new request with the data to save to the component
            $newRequest = new Request();
            $newRequest->merge($attrs);

            // Save the fields of this blocks to the model
            foreach ($this->components as $component) {
                $component->save($foreignModel, $newRequest);
            }

            // Save the foreign model to the relation on the current model
            $model->{$this->getName()}()->save($foreignModel);
        }
    }

    private function createForeignItems(Model $model, array $rows)
    {
        $foreignModelClassname = $this->meta::getModel();

        foreach ($rows as $attrs) {

            // Create new foreign model
            $foreignModel = new $foreignModelClassname();

            // Create a new request with the data to save to the component
            $newRequest = new Request();
            $newRequest->merge($attrs);

            // Save the fields of this blocks to the model
            foreach ($this->components as $component) {
                $component->save($foreignModel, $newRequest);
            }

            // Save the foreign model to the relation on the current model
            $model->{$this->getName()}()->save($foreignModel);
        }
    }
}
