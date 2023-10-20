<?php

namespace ReinVanOyen\Cmf\Searchers;

use Illuminate\Http\Request;

class LikeSearcher extends Searcher
{
    /**
     * @var array $columns
     */
    private $columns;

    /**
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
        return 'like-searcher';
    }

    /**
     * @param Request $request
     * @param $query
     * @return mixed
     */
    public function apply(Request $request, $query)
    {
        if ($request->input('search')) {

            $keyword = $request->input('search');

            return $query->where(function ($query) use ($keyword) {
                foreach ($this->columns as $column) {
                    $query->orWhere($column, 'like', "%{$keyword}%");
                }
            });
        }

        return $query;
    }
}
