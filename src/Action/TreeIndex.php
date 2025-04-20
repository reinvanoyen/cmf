<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelCollection;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Http\Resources\TreeModelCollection;
use ReinVanOyen\Cmf\Traits\HasSingularPlural;

class TreeIndex extends Action
{
    use HasSingularPlural;

    /**
     * @var string $model
     */
    protected $model;

    /**
     * @var string $parentRelationName
     */
    private string $parentRelationName;

    /**
     * @var string $orderColumn
     */
    private string $orderColumn;

    /**
     * @var array $actions
     */
    private array $actions = [];

    /**
     * @var array $components
     */
    protected $components = [];

    /**
     * @param string $meta
     * @param string $parentRelationName
     * @param string $orderColumn
     * @param array $components
     * @throws \ReinVanOyen\Cmf\Exceptions\InvalidMetaException
     */
    public function __construct(string $meta, string $parentRelationName, string $orderColumn, array $components = [])
    {
        $this->meta($meta);

        $this->parentRelationName = $parentRelationName;
        $this->orderColumn = $orderColumn;

        $this->singular($this->getMeta()::getSingular());
        $this->plural($this->getMeta()::getPlural());

        $this->components(count($components) ? $components : $this->getMeta()::index());
        $this->model = $this->getMeta()::getModel();
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'tree-index';
    }

    /**
     * @param string $actionPath
     * @return $this
     */
    public function action(string $actionPath)
    {
        $this->export('action', $actionPath);
        return $this;
    }

    /**
     * @param array $actions
     * @return $this
     */
    public function actions(array $actions)
    {
        $this->actions = $actions;
        $this->export('actions', $actions);
        return $this;
    }

    /**
     * @param Request $request
     * @return TreeModelCollection
     */
    public function apiLoad(Request $request)
    {
        TreeModelCollection::textColumn($this->getMeta()::getTitleColumn());
        TreeModelCollection::parentRelation($this->parentRelationName);

        return new TreeModelCollection($this->model::orderBy($this->orderColumn)->get());
    }

    /**
     * @param Request $request
     * @return ModelCollection
     */
    /*
    public function apiLoad(Request $request)
    {
        ModelCollection::provision($this->components);

        return new ModelCollection($this->getResults($request));
    }*/

    /**
     * @param $ids
     * @return void
     */
    private function updateOrder($ids = [])
    {
        $modelClass = $this->getMeta()::getModel();

        // Update the order of the children
        $orderValue = 0;
        foreach ($ids as $childId) {
            $childModel = $modelClass::findOrFail($childId);
            $childModel->{$this->orderColumn} = $orderValue;
            $childModel->save();
            $orderValue++;
        }
    }

    /**
     * @param Request $request
     * @return ModelResource
     */
    public function apiUpdateParent(Request $request)
    {
        $modelClass = $this->getMeta()::getModel();

        // Get model and update it's parent relation
        $model = $modelClass::findOrFail($request->input('id'));
        $model->{$this->parentRelationName}()->associate($request->input('parentId'));
        $model->save();

        $this->updateOrder($request->input('children'));

        return true;
    }

    /**
     * @param Request $request
     * @return ModelResource
     */
    public function apiUpdateOrder(Request $request)
    {
        $this->updateOrder($request->input('children'));

        return true;
    }
}
