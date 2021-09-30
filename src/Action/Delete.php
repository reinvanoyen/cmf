<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Traits\CanRedirect;
use ReinVanOyen\Cmf\Traits\HasSingularPlural;

class Delete extends Action
{
    use CanRedirect;
    use HasSingularPlural;

    /**
     * Delete constructor.
     * @param string $meta
     */
    public function __construct(string $meta)
    {
        $this->meta($meta);
        $this->singular($meta::getSingular());
        $this->plural($meta::getPlural());
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'delete';
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function apiDelete(Request $request)
    {
        $modelClass = $this->getMeta()::getModel();

        // Delete model
        $model = $modelClass::findOrFail($request->input('id'));
        $model->delete();

        return true;
    }
}
