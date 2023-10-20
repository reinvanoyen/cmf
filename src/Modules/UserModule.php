<?php

namespace ReinVanOyen\Cmf\Modules;

use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\Delete;
use ReinVanOyen\Cmf\Action\Index;
use ReinVanOyen\Cmf\Action\Create;
use ReinVanOyen\Cmf\Action\Edit;
use ReinVanOyen\Cmf\Components\Icon;
use ReinVanOyen\Cmf\Meta\UserMeta;
use ReinVanOyen\Cmf\Module;
use ReinVanOyen\Cmf\Components\Link;

class UserModule extends Module
{
    /**
     * @return string
     */
    protected function title(): string
    {
        return 'User management';
    }

    /**
     * @return string
     */
    protected function icon()
    {
        return 'people';
    }

    /**
     * @return bool
     */
    public function inPrimaryNavigation(): bool
    {
        return false;
    }

    /**
     * @return bool
     */
    public function inSecondaryNavigation(): bool
    {
        return true;
    }

    /**
     * @return Action
     */
    public function index(): Action
    {
        return Index::make(UserMeta::class)
            ->header([
                Link::make('New user', 'create')
                    ->style('primary'),
            ])
            ->actions([
                Icon::make('edit')->to('edit'),
                Icon::make('delete')->to('delete'),
            ])
            ->action('edit');
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
