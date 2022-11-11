<?php

namespace ReinVanOyen\Cmf\Tests\Fixtures\Modules;

use App\Cmf\Meta\UserMeta;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\Create;
use ReinVanOyen\Cmf\Action\Delete;
use ReinVanOyen\Cmf\Action\Edit;
use ReinVanOyen\Cmf\Action\Index;
use ReinVanOyen\Cmf\Components\Link;
use ReinVanOyen\Cmf\Module;

class UserModule extends Module
{
    /**
     * @return string
     */
    protected function title(): string
    {
        return 'Users';
    }

    /**
     * @return string
     */
    protected function icon()
    {
        return 'people';
    }

    /**
     * @return Action
     */
    public function index(): Action
    {
        return Index::make(UserMeta::class)
            ->action('edit')
            ->grid([1, 1, 0, 0,])
            ->header([
                Link::make('New user', 'create')
                    ->style('button'),
            ])
            ->search(['name',]);
    }

    /**
     * @return Action
     */
    public function create(): Action
    {
        return Create::make(UserMeta::class);
    }

    /**
     * @return Action
     */
    public function edit(): Action
    {
        return Edit::make(UserMeta::class);
    }

    /**
     * @return Action
     */
    public function delete(): Action
    {
        return Delete::make(UserMeta::class);
    }
}
