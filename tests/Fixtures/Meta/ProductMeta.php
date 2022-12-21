<?php

namespace ReinVanOyen\Cmf\Tests\Fixtures\Meta;

use ReinVanOyen\Cmf\Components\RichtextField;
use ReinVanOyen\Cmf\Components\TextField;
use ReinVanOyen\Cmf\Components\TextView;
use ReinVanOyen\Cmf\Meta;
use ReinVanOyen\Cmf\Tests\Fixtures\Models\Product;

class ProductMeta extends Meta
{
    /**
     * @var string $model
     */
    protected static $model = Product::class;

    /**
     * @var string $title
     */
    protected static $title = 'title';

    /**
     * @var array $search
     */
    protected static $search = [
        'title',
    ];

    /**
     * @var array $sort
     */
    protected static $sort = [
        'title' => 'asc',
    ];

    /**
     * @return array
     */
    public static function index(): array
    {
        return [
            TextView::make('title'),
            TextView::make('slug'),
        ];
    }

    /**
     * @return array
     */
    public static function create(): array
    {
        return [
            TextField::make('title')->validate(['required',]),
            TextField::make('slug')->validate(['required',]),
            RichtextField::make('description'),
        ];
    }
}
