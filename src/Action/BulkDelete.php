<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelCollection;
use ReinVanOyen\Cmf\Traits\CanRedirect;
use ReinVanOyen\Cmf\Traits\HasSingularPlural;

class BulkDelete extends Action
{
    use CanRedirect;
    use HasSingularPlural;

    /**
     * @param string $meta
     * @throws \ReinVanOyen\Cmf\Exceptions\InvalidMetaException
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
        return 'bulk-delete';
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function apiDelete(Request $request): bool
    {
        $modelClass = $this->getMeta()::getModel();
        $allModels = $modelClass::whereIn('id', $request->input('ids'))->get();

        foreach ($allModels as $model) {
            $model->delete();
        }

        return true;
    }
}
