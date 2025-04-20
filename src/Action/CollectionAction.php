<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Filters\Filter;
use ReinVanOyen\Cmf\Http\Resources\ModelCollection;
use ReinVanOyen\Cmf\Sorters\Sorter;
use ReinVanOyen\Cmf\Traits\BuildsQuery;
use ReinVanOyen\Cmf\Traits\HasSingularPlural;

/**
 * Class CollectionAction
 * @package ReinVanOyen\Cmf\Action
 */
abstract class CollectionAction extends Action
{
    use BuildsQuery;
    use HasSingularPlural;

    /**
     * @var array $components
     */
    protected $components = [];

    /**
     * @param Filter $filter
     * @return $this
     */
    public function filter(Filter $filter)
    {
        $filter->resolve($this);
        $this->filters[] = $filter;
        $this->export('filters', $this->filters);
        return $this;
    }

    /**
     * @param Sorter $sorter
     * @return $this
     */
    public function sorter(Sorter $sorter)
    {
        $sorter->resolve($this);
        $this->sorter = $sorter;
        $this->export('sorter', $this->sorter);
        return $this;
    }

    /**
     * @return Sorter
     */
    public function getSorter(): Sorter
    {
        return $this->sorter;
    }

    /**
     * @param string $relationship
     * @return $this
     */
    public function relationship(string $relationship)
    {
        $this->relationship = $relationship;
        $this->export('relationship', true);
        return $this;
    }

    /**
     * @param Request $request
     * @return ModelCollection
     */
    public function apiLoad(Request $request)
    {
        ModelCollection::provision($this->components);

        return new ModelCollection($this->getResults($request));
    }
}
