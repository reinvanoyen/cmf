<?php

namespace ReinVanOyen\Cmf\Filters;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;
use ReinVanOyen\Cmf\Traits\BuildsQuery;
use ReinVanOyen\Cmf\Traits\HasLabel;

class BelongsToFilter extends Filter
{
    use BuildsQuery;
    use HasLabel;

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
     * EnumFilter constructor.
     * @param string $field
     */
    public function __construct(string $field, string $meta = null)
    {
        $this->field = $field;
        $this->export('field', $field);

        $meta = $meta ?: RelationshipMetaGuesser::getMeta($this->field);

        $this->model = $meta::getModel();
        $this->titleColumn($meta::getTitleColumn());
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
     * @param $query
     */
    public function apply(Request $request, $query)
    {
        $filterName = 'filter_'.$this->getId();

        if ($request->has($filterName) && $request->input($filterName) !== null) {

            $filterValues = explode(',', $request->input($filterName));

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
