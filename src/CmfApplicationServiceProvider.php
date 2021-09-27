<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\Facades\Config;
use Illuminate\Support\ServiceProvider;
use ReinVanOyen\Cmf\Events\ServingCmf;

class CmfApplicationServiceProvider extends ServiceProvider
{
    /**
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function boot()
    {
        $cmf = $this->app->make(Cmf::class);

        $cmf->serving(function (ServingCmf $event) use ($cmf) {
            $cmf->registerModules($this->modules());
        });
    }

    /**
     * @return array
     */
    protected function modules(): array
    {
        return [];
    }
}
