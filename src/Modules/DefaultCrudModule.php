<?php

namespace ReinVanOyen\Cmf\Modules;

use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\Create;
use ReinVanOyen\Cmf\Action\Delete;
use ReinVanOyen\Cmf\Action\Edit;
use ReinVanOyen\Cmf\Action\Index;
use ReinVanOyen\Cmf\Components\Link;
use ReinVanOyen\Cmf\Module;

abstract class DefaultCrudModule extends Module
{
    protected $model;
    protected $singular = 'item';
    protected $plural = 'items';

    abstract protected function indexComponents(): array;
    abstract protected function createComponents(): array;
    abstract protected function editComponents(): array;

    /**
     * @return Action
     */
    public function index(): Action
    {
        $indexComponents = $this->indexComponents();
        $indexComponents[] = Link::make('Delete', 'delete');

        return Index::make($this->model, $indexComponents)
            ->action('edit')
            ->header([
                Link::make('New '.$this->singular, 'create')
                    ->style('button'),
            ]);
    }

    /**
     * @return Action
     */
    public function edit(): Action
    {
        return Edit::make($this->model, $this->editComponents());
    }

    /**
     * @return Action
     */
    public function create(): Action
    {
        return Create::make($this->model, $this->createComponents());
    }

    /**
     * @return Action
     */
    public function delete(): Action
    {
        return Delete::make($this->model);
    }
}
