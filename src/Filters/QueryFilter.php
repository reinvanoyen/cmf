<?php

namespace ReinVanOyen\Cmf\Filters;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Traits\HasLabel;

class QueryFilter extends Filter
{
    use HasLabel;

    /**
     * @var array $options
     */
    private $options = [];

    /**
     * @var array $queries
     */
    private $queries = [];

    /**
     * @return string
     */
    public function type(): string
    {
        return 'query-filter';
    }

    /**
     * @param string $name
     * @param string $label
     * @param callable $query
     * @return $this
     */
    public function option(string $name, string $label, callable $query)
    {
        $this->options[$name] = $label;
        $this->queries[$name] = $query;
        $this->export('options', $this->options);
        return $this;
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

            foreach ($filterValues as $filterValue) {
                if ($this->queries[$filterValue]) {
                    $this->queries[$filterValue]($query);
                }
            }
        }
    }
}
