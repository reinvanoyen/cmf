<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\Str;

abstract class Meta
{
    /**
     * @var string $model
     */
    protected static $model;

    /**
     * @var string $title
     */
    protected static $title;

    /**
     * @var int $perPage
     */
    protected static $perPage = 10;

    /**
     * @var array $search
     */
    protected static $search = [];

    /**
     * @var array $sort
     */
    protected static $sort = [];

    /**
     * Get the model classname of this meta
     *
     * @return string
     */
    final public static function getModel(): string
    {
        return static::$model;
    }

    /**
     * Get the column representing the title for this meta
     *
     * @return string
     */
    final public static function getTitleColumn(): string
    {
        return static::$title;
    }

    /**
     * Get the singular word for this meta
     *
     * @return string
     */
    public static function getSingular(): string
    {
        return Str::lower(Str::singular(class_basename(static::$model)));
    }

    /**
     * Get the plural word for this meta
     *
     * @return string
     */
    public static function getPlural(): string
    {
        return Str::lower(Str::plural(class_basename(static::$model)));
    }

    /**
     * Get the amount of items per page for this meta
     *
     * @return int
     */
    public static function getPerPage(): int
    {
        return static::$perPage;
    }

    /**
     * Get the searchable columns for this meta
     *
     * @return array
     */
    public static function getSearchColumns(): array
    {
        return static::$search;
    }

    /**
     * Get the default sorting columns and methods
     *
     * @return array
     */
    public static function getSorting(): array
    {
        return static::$sort;
    }

    /**
     * @return array
     */
    public static function sidebar(): array
    {
        return [];
    }

    /**
     * @return array
     */
    public static function index(): array
    {
        return [];
    }

    /**
     * @return array
     */
    public static function create(): array
    {
        return [];
    }

    /**
     * @return array
     */
    public static function edit(): array
    {
        return static::create();
    }

    /**
     * @return array
     */
    public static function view(): array
    {
        return [];
    }
}
