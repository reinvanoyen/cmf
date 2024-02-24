<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelCollection;
use ReinVanOyen\Cmf\Traits\CanRedirect;
use ReinVanOyen\Cmf\Traits\HasSingularPlural;

class SelectOne extends Action
{
    use CanRedirect;
    use HasSingularPlural;

    private $execute;

    /**
     * @param string $meta
     * @throws \ReinVanOyen\Cmf\Exceptions\InvalidMetaException
     */
    public function __construct(string $meta)
    {
        $this->meta($meta);
        $this->singular($meta::getSingular());
        $this->plural($meta::getPlural());
        $this->components($this->getMeta()::card());
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'select-one';
    }

    /**
     * @param callable $execute
     * @return $this
     */
    public function select(callable $execute)
    {
        $this->execute = $execute;
        return $this;
    }

    /**
     * @param Request $request
     * @return true
     */
    public function apiLoadOptions(Request $request)
    {
        $ids = $request->input('id');
        if (is_string($ids)) {
            $ids = explode(',', $ids);
        }

        $modelClass = $this->getMeta()::getModel();
        ModelCollection::provision($this->components);

        return new ModelCollection($modelClass::whereIn('id', $ids)->get());
    }

    /**
     * @param Request $request
     * @return bool
     */
    public function apiExecute(Request $request)
    {
        if ($this->execute) {

            $modelClass = $this->getMeta()::getModel();
            $selectedModal = $modelClass::findOrFail($request->input('selectedId'));
            $allModels = $modelClass::whereIn('id', $request->input('ids'))->get();

            call_user_func_array($this->execute, [$selectedModal, $allModels]);
        }

        return true;
    }
}
