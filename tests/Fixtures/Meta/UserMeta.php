<?php

namespace ReinVanOyen\Cmf\Tests\Fixtures\Meta;

use ReinVanOyen\Cmf\Tests\Fixtures\Models\User;
use ReinVanOyen\Cmf\Components\PasswordField;
use ReinVanOyen\Cmf\Components\TextField;
use ReinVanOyen\Cmf\Components\TextView;
use ReinVanOyen\Cmf\Meta;

class UserMeta extends Meta
{
    /**
     * @var string $model
     */
    protected static $model = User::class;

    /**
     * @var string $title
     */
    protected static $title = 'name';

    /**
     * @var array $search
     */
    protected static $search = [
        'name',
    ];

    /**
     * @var array $sort
     */
    protected static $sort = [
        'name' => 'asc',
    ];

    /**
     * @return array
     */
    public static function index(): array
    {
        return [
            TextView::make('name'),
            TextView::make('email'),
        ];
    }

    /**
     * @return array
     */
    public static function create(): array
    {
        return [
            TextField::make('name')
                ->validate(['required',]),
            TextField::make('email')->validate(['required', 'email',]),
            PasswordField::make('password')->validate(['required','min:8']),
        ];
    }

    public static function edit(): array
    {
        return [
            TextField::make('name')->validate(['required',]),
            TextField::make('email')->validate(['required', 'email',]),
            PasswordField::make('password')->validate(['nullable','min:8',]),
        ];
    }
}
