<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Traits\CanRedirect;

class Delete extends Action
{
    use CanRedirect;

    /**
     * @var string $model
     */
    private $model;

    /**
     * Delete constructor.
     * @param string $model
     */
    public function __construct(string $model)
    {
        $this->model = $model;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'delete';
    }

    public function delete(Request $request)
    {
        // Delete model
        $model = $this->model::findOrFail($request->input('id'));
        $model->delete();

        return true;
    }
}
