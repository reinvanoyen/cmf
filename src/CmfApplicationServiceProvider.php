<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\ServiceProvider;
use ReinVanOyen\Cmf\Events\ServingCmf;
use Illuminate\Foundation\Auth\User;

class CmfApplicationServiceProvider extends ServiceProvider
{
    /**
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function boot()
    {
        $cmf = $this->app->make(Cmf::class);

        $cmf->setGate(function ($user) {
            return $this->gate($user);
        });

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

    /**
     * @param User $user
     * @return bool
     */
    public function gate(User $user)
    {
        return true;
    }
}
