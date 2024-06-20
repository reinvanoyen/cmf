<?php

namespace ReinVanOyen\Cmf\Filters;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;
use ReinVanOyen\Cmf\Traits\BuildsQuery;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasSorter;

class BelongsToFilter extends Filter
{
    use BuildsQuery;
    use HasLabel;
    use HasSorter;

    /**
     * @var string $field
     */
    private $field;

    /**
     * @var string $model
     */
    private $model;

    /**
     * @var string $titleColumn
     */
    private $titleColumn;

    /**
     * @var callable $defaultCallable
     */
    private $defaultCallable;

    /**
     * @var array $defaultValues
     */
    private $defaultValues = [];

    /**
     * @param string $field
     * @param string|null $meta
     * @throws \ReinVanOyen\Cmf\Exceptions\CouldntGuessMetaException
     */
    public function __construct(string $field, string $meta = null)
    {
        $this->field = $field;
        $this->export('field', $field);

        $meta = $meta ?: RelationshipMetaGuesser::getMeta($this->field);

        $this->model = $meta::getModel();
        $this->titleColumn($meta::getTitleColumn());
        $this->sorter($meta::sorter());
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'belongs-to-filter';
    }

    /**
     * @param string $field
     * @return $this
     */
    public function titleColumn(string $field)
    {
        $this->titleColumn = $field;
        $this->export('titleColumn', $this->titleColumn);
        return $this;
    }

    /**
     * Registers a callable that returns the default selected values (a collection of models)
     * @param callable $defaultCallable
     * @return $this
     */
    public function default(callable $defaultCallable): static
    {
        $this->defaultCallable = $defaultCallable;
        $this->export('usesDefaultValues', true);

        ModelResource::fields([$this->titleColumn,]);

        $this->export('defaultValues', ModelResource::collection(
            $this->getDefaultValues()
        ));
        return $this;
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function apiLoadOptions(Request $request)
    {
        ModelResource::fields([$this->titleColumn,]);

        return ModelResource::collection(
            $this->getResults($request)
        )->additional([
            'default' => ModelResource::collection($this->getDefaultValues($request)),
        ]);
    }

    /**
     * @return Collection
     */
    private function getDefaultValues(): Collection
    {
        return (is_callable($this->defaultCallable) ? call_user_func($this->defaultCallable) : Collection::make());
    }

    /**
     * @param Request $request
     * @param $query
     */
    public function apply(Request $request, $query)
    {
        $isFiltering = $request->has('filters');
        $filterName = 'filter_'.$this->getId();

        $filterValues = [];

        if ($request->has($filterName) && $request->input($filterName) !== null) {
            $filterValues = explode(',', $request->input($filterName));
        } elseif (! $isFiltering) {
            $defaultValues = $this->getDefaultValues();
            $filterValues = $defaultValues->map(function ($value) {
                return $value->id;
            });
        }

        if (count($filterValues)) {
            $query->where(function ($query) use ($filterValues) {
                foreach ($filterValues as $value) {
                    $query->orWhereHas($this->field, function ($query) use ($value) {
                        $query->where('id', $value);
                    });
                }
            });
        }
    }
}
