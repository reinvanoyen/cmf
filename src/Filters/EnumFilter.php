<?php

namespace ReinVanOyen\Cmf\Filters;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Traits\HasLabel;

class EnumFilter extends Filter
{
    use HasLabel;

    /**
     * @var string $field
     */
    private $field;

    /**
     * @var array $options
     */
    private $options = [];

    /**
     * @param string $field
     * @param $options
     */
    public function __construct(string $field, $options = [])
    {
        $this->field = $field;
        $this->export('field', $field);
        $this->options($options);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'enum-filter';
    }

    /**
     * @param array $options
     * @return $this
     */
    public function options(array $options)
    {
        $this->options = $options;
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

            $query->where(function ($query) use ($filterValues) {
                foreach ($filterValues as $value) {
                    $query->orWhere($this->field, $value);
                }
            });
        }
    }
}
