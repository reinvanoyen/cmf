<?php

namespace ReinVanOyen\Cmf\Filters;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Traits\HasLabel;

class BooleanFilter extends Filter
{
    use HasLabel;

    /**
     * @var string $field
     */
    private $field;

    /**
     * @var bool $reverse
     */
    private $reverse = false;

    /**
     * EnumFilter constructor.
     * @param string $field
     */
    public function __construct(string $field)
    {
        $this->field = $field;
        $this->export('field', $field);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'boolean-filter';
    }

    /**
     * @return $this
     */
    public function reverse(): self
    {
        $this->reverse = true;
        return $this;
    }

    /**
     * @param Request $request
     * @param $query
     */
    public function apply(Request $request, $query)
    {
        $filterName = 'filter_'.$this->getId();

        if (
            $request->has($filterName) &&
            $request->input($filterName) !== null &&
            $request->input($filterName)
        ) {
            $query->where($this->field, ! $this->reverse);
        }
    }
}
