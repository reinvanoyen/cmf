<?php

namespace ReinVanOyen\Cmf\Tests\Fixtures\Modules;

use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\Create;
use ReinVanOyen\Cmf\Action\Delete;
use ReinVanOyen\Cmf\Action\Edit;
use ReinVanOyen\Cmf\Action\Index;
use ReinVanOyen\Cmf\Components\Link;
use ReinVanOyen\Cmf\Module;
use ReinVanOyen\Cmf\Tests\Fixtures\Meta\ProductMeta;

class ProductModule extends Module
{
    /**
     * @return string
     */
    protected function title(): string
    {
        return 'Products';
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
        return Index::make(ProductMeta::class)
            ->action('edit')
            ->header([
                Link::make('New product', 'create')
                    ->style('button'),
            ]);
    }

    /**
     * @return Action
     */
    public function create(): Action
    {
        return Create::make(ProductMeta::class);
    }

    /**
     * @return Action
     */
    public function edit(): Action
    {
        return Edit::make(ProductMeta::class);
    }

    /**
     * @return Action
     */
    public function delete(): Action
    {
        return Delete::make(ProductMeta::class);
    }
}
