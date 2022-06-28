<?php

namespace ReinVanOyen\Cmf\Traits;

use Illuminate\Http\Request;

trait BuildsQuery
{
    /**
     * @var string $relationship
     */
    private $relationship;

    /**
     * @var string $restrictByFk
     */
    private $restrictByFk;

    /**
     * @var array $orderBy
     */
    private $orderBy = [];

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
     * @var array $whereNull
     */
    private $whereNull = [];

    /**
     * @var array $filters
     */
    private $filters = [];

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
     * @return $this
     */
    public function whereNull(string $column)
    {
        $this->whereNull[] = $column;
        return $this;
    }

    /**
     * @param string $column
     * @param string $method
     * @param bool $reset
     * @return $this
     */
    public function orderBy(string $column, string $method = 'asc', $reset = false)
    {
        if ($reset) $this->orderBy = [];

        $this->orderBy[$column] = $method;
        return $this;
    }

    /**
     * @param int $limit
     * @return $this
     */
    public function limit(int $limit)
    {
        $this->perPage = false;

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
     * @return mixed
     */
    public function getResults(Request $request)
    {
        /*
         * Build a base query
         * */
        if ($this->restrictByFk) {

            $query = $this->model::where($this->restrictByFk, $request->input('foreign'));

        } else if ($this->relationship) {

            $query = $this->model::find($request->input('relation'))
                ->{$this->relationship}();

        } else {

            $query = $this->model::query();
        }

        /*
         * If a where clause is specified, use it on the query
         * */
        if (count($this->where)) {
            foreach ($this->where as $key => $value) {
                $query = $query->where($key, $value);
            }
        }

        if (count($this->whereNull)) {
            foreach ($this->whereNull as $column) {
                $query = $query->whereNull($column);
            }
        }

        /*
         * If there is an order specified, use it on the query
         * */
        foreach ($this->orderBy as $column => $method) {
            $query = $query->orderBy($column, $method);
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
