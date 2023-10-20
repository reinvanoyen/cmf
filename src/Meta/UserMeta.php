<?php

namespace ReinVanOyen\Cmf\Meta;

use ReinVanOyen\Cmf\Components\PasswordField;
use ReinVanOyen\Cmf\Components\Stack;
use ReinVanOyen\Cmf\Components\TextField;
use ReinVanOyen\Cmf\Components\TextView;
use ReinVanOyen\Cmf\Meta;
use App\Models\User;
use ReinVanOyen\Cmf\Searchers\LikeSearcher;
use ReinVanOyen\Cmf\Searchers\Searcher;
use ReinVanOyen\Cmf\Sorters\Sorter;
use ReinVanOyen\Cmf\Sorters\StaticSorter;

class UserMeta extends Meta
{
    /**
     * @var string $model
     */
    protected static $model = User::class;

    /**
     * @var string $title
     */
    protected static $title = 'first_name';

    /**
     * @var int $perPage
     */
    protected static $perPage = 10;

    /**
     * @var int[] $indexGrid
     */
    protected static $indexGrid = [
        0, 1, 1,
    ];

    /**
     * @return Searcher|null
     */
    public static function searcher(): ?Searcher
    {
        return LikeSearcher::make(['email', 'name']);
    }

    /**
     * @return Sorter
     */
    public static function sorter(): Sorter
    {
        return StaticSorter::make([
            'name' => 'asc',
        ]);
    }

    /**
     * @return array
     */
    public static function index(): array
    {
        return [
            Stack::make([
                TextView::make('name')->style('primary'),
                TextView::make('email'),
            ])->vertical()->gapless(),
        ];
    }

    /**
     * @return array
     */
    public static function create(): array
    {
        return [
            TextField::make('email')->validate(['email', 'required']),
            TextField::make('name')->validate(['required']),
            PasswordField::make('password'),
        ];
    }
}
