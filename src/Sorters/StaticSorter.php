<?php

namespace ReinVanOyen\Cmf\Sorters;

use Illuminate\Http\Request;

/**
 * Class StaticSorter
 * @package ReinVanOyen\Cmf\Sorters
 */
class StaticSorter extends Sorter
{
    /**
     * @var array $columns
     */
    private $columns;

    /**
     * StaticSorter constructor.
     * @param array $columns
     */
    public function __construct(array $columns)
    {
        $this->columns = $columns;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'static-sorter';
    }

    /**
     * @param Request $request
     * @param $query
     * @return mixed
     */
    public function apply(Request $request, $query)
    {
        foreach ($this->columns as $column => $method) {
            $query = $query->orderBy($column, $method);
        }

        return $query;
    }
}
