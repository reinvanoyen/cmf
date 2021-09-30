<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;
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
     * @var string $titleColumn
     */
    private $titleColumn;

    /**
     * @var bool $isNullable
     */
    private $isNullable;

    /**
     * BelongsToField constructor.
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->name($name);
        $this->label(Str::labelify($name));

        $meta = RelationshipMetaGuesser::getMeta($this->getName());
        $this->model = $meta::getModel();
        $this->titleColumn($meta::getTitleColumn());
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

        if ($this->isNullable) {
            $relation->dissociate();
        }
    }
}
