<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\BuildsQuery;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

class BelongsToField extends Component
{
    use HasName;
    use HasLabel;
    use BuildsQuery;

    /**
     * @var string $titleField
     */
    private $titleField;

    /**
     * BelongsToField constructor.
     * @param string $name
     * @param string $model
     */
    public function __construct(string $name, string $model)
    {
        $this->name($name);
        $this->label(Str::labelify($name));
        $this->titleField('title');

        $this->model = $model;
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
    public function allowNull()
    {
        $this->export('allowNull', true);
        return $this;
    }

    /**
     * @param string $field
     * @return $this
     */
    public function titleField(string $field)
    {
        $this->titleField = $field;
        $this->export('titleField', $this->titleField);
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
    public function load(Request $request)
    {
        ModelResource::fields([$this->titleField,]);

        return ModelResource::collection(
            $this->getResults($request)
        );
    }

    /**
     * @param Model $model
     * @param Request $request
     */
    public function save(Model $model, Request $request)
    {
        $relation = $model->{$this->getName()}();

        if ($request->input($this->getName())) {

            $relatedModel = $this->model::findOrFail($request->input($this->getName()));
            $relation->associate($relatedModel);

            return;
        }

        $relation->dissociate();
    }
}
