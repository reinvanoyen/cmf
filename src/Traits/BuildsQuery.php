<?php

namespace ReinVanOyen\Cmf\Traits;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Filters\Filter;

trait BuildsQuery
{
    /**
     * @var string $model
     */
    private $model;

    /**
     * @var $restrictByFk
     */
    private $restrictByFk;

    /**
     * @var string $orderByColumn
     */
    private $orderByColumn;

    /**
     * @var string $orderByMethod
     */
    private $orderByMethod;

    /**
     * @var int $limit
     */
    private $limit;

    /**
     * @var int $perPage
     */
    private $perPage;

    /**
     * @var array $searchFields
     */
    private $searchFields;

    /**
     * @var array $where
     */
    private $where = [];

    /**
     * @var array $filters
     */
    private $filters = [];

    /**
     * @param Filter $filter
     */
    public function filter(Filter $filter)
    {
        $this->filters[] = $filter;
        $this->export('filters', $this->filters);
    }

    /**
     * @param string $column
     * @return $this
     */
    public function restrictByForeignKey(string $column)
    {
        $this->restrictByFk = $column;
        $this->export('restrictByFk', $column);
        return $this;
    }

    /**
     * @param string $field
     * @param string $value
     * @return $this
     */
    public function where(string $field, string $value)
    {
        $this->where[$field] = $value;
        return $this;
    }

    /**
     * @param string $column
     * @param string $method
     * @return $this
     */
    public function orderBy(string $column, string $method = 'asc')
    {
        $this->orderByColumn = $column;
        $this->orderByMethod = $method;
        return $this;
    }

    /**
     * @param int $limit
     * @return $this
     */
    public function limit(int $limit)
    {
        $this->limit = $limit;
        return $this;
    }

    /**
     * @param int $perPage
     * @return $this
     */
    public function paginate(int $perPage)
    {
        $this->perPage = $perPage;
        return $this;
    }

    /**
     * @param array $searchFields
     * @return $this
     */
    public function search(array $searchFields)
    {
        $this->searchFields = $searchFields;
        $this->export('search', true);
        return $this;
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function getResults(Request $request)
    {
        /*
         * Build a base query
         * */
        $query = ($this->restrictByFk ? $this->model::where($this->restrictByFk, $request->input('fk')) : $this->model::query());

        /*
         * If a where clause is specified, use it on the query
         * */
        if (count($this->where)) {
            foreach ($this->where as $key => $value) {
                $query = $query->where($key, $value);
            }
        }

        /*
         * If there is an order specified, use it on the query
         * */
        if ($this->orderByColumn && $this->orderByMethod) {
            $query = $query->orderBy($this->orderByColumn, $this->orderByMethod);
        }

        /*
         * If a limit is set, add the limit to the query
         * */
        if ($this->limit) {
            $query = $query->limit($this->limit);
        }

        /*
         * If the user is searching, add the search to the query
         * */
        if ($this->searchFields && $request->input('search')) {

            $keyword = $request->input('search');

            $query = $query->where(function ($query) use ($keyword) {
                foreach ($this->searchFields as $searchField) {
                    $query->orWhere($searchField, 'like', "%{$keyword}%");
                }
            });
        }

        /*
         * Apply the filters
         * */
        foreach ($this->filters as $filter) {
            $filter->apply($request, $query);
        }

        /*
         * Paginate
         * */
        if ($this->perPage) {
            $collection = $query->paginate($this->perPage);
        } else {
            $collection = $query->get();
        }

        return $collection;
    }
}
