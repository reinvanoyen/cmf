<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\Str;
use ReinVanOyen\Cmf\Searchers\Searcher;
use ReinVanOyen\Cmf\Sorters\Sorter;
use ReinVanOyen\Cmf\Sorters\StaticSorter;

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
     * @var array $indexGrid
     */
    protected static $indexGrid = [];

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
     * Get grid definition for the index
     *
     * @return array
     */
    public static function getIndexGrid(): array
    {
        return static::$indexGrid;
    }

    /**
     * @return array
     */
    public static function getIndexHeaderLabels(): array
    {
        return [];
    }

    /**
     * @return Sorter
     */
    public static function sorter(): Sorter
    {
        return StaticSorter::make([
            'created_at' => 'asc',
        ]);
    }

    /**
     * @return Searcher|null
     */
    public static function searcher(): ?Searcher
    {
        return null;
    }

    /**
     * @return array
     */
    public static function filters(): array
    {
        return [];
    }

    /**
     * @return array
     */
    public static function card(): array
    {
        return [];
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
