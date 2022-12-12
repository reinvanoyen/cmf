<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ContentBlockResource;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\HasItemGrammar;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasTooltip;

class ContentBlocks extends Component
{
    use HasName;
    use HasLabel;
    use HasTooltip;
    use HasItemGrammar;

    /**
     * @var string $foreignTypeColumn
     */
    private $foreignTypeColumn;

    /**
     * @var string $foreignOrderColumn
     */
    private $foreignOrderColumn;

    /**
     * @var array $blocks
     */
    private $blocks = [];

    /**
     * @var string $meta
     */
    private $meta;

    /**
     * ContentBlocks constructor.
     * @param string $name
     * @param string $foreignTypeColumn
     * @param string $foreignOrderColumn
     * @param string $meta
     */
    public function __construct(string $name, string $foreignTypeColumn, string $foreignOrderColumn, string $meta = null)
    {
        $this->name($name);
        $this->label(Str::labelify($name));

        $this->foreignTypeColumn = $foreignTypeColumn;
        $this->foreignOrderColumn = $foreignOrderColumn;

        $this->export('typeColumn', $this->foreignTypeColumn);
        $this->export('orderColumn', $this->foreignOrderColumn);

        $this->meta = $meta ?: RelationshipMetaGuesser::getMeta($this->getName());
        $this->singular($this->meta::getSingular());
        $this->plural($this->meta::getPlural());
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'content-blocks';
    }

    /**
     * @param string $typeName
     * @param string $typeValue
     * @param array $components
     * @return $this
     */
    public function block(string $typeName, string $typeValue, array $components)
    {
        $this->blocks[$typeValue] = [
            'name' => $typeName,
            'type' => $typeValue,
            'components' => $components,
        ];

        $this->export('blocks', $this->blocks);
        return $this;
    }

    /**
     * @param Model $model
     * @param Request $request
     */
    public function save(Model $model, Request $request)
    {
        $payload = json_decode($request->input($this->getName()), true);

        $model::saved(function ($model) use ($payload) {
            $this->removeBlocks($model, $payload['removeById'], $payload['removeByOrder']);
            $this->fixOrderOfBlocks($model);
            $this->updateOrCreateBlocks($model, $payload['update']);
        });
    }

    private function removeBlocks(Model $model, $byId, $byOrder)
    {
        $foreignModelClassname = $this->meta::getModel();
        $foreignModelClassname::destroy($byId);

        // Delete by order
        foreach ($byOrder as $order) {
            $block = $model->{$this->getName()}()->first();
            if ($block) {
                $block->delete();
            }
        }
    }

    private function fixOrderOfBlocks(Model $model)
    {
        // Fix the orders of the remaining items
        $currentItems = $model->{$this->getName()}()->orderBy($this->foreignOrderColumn)->get();
        foreach ($currentItems as $index => $currentItem) {
            $currentItem->{$this->foreignOrderColumn} = $index;
            $currentItem->save();
        }
    }

    private function updateOrCreateBlocks(Model $model, $items)
    {
        $foreignModelClassname = $this->meta::getModel();

        // Update or create blocks
        foreach ($items as $item) {

            $id = $item['id'];
            $type = $item['type'];
            $order = $item[$this->foreignOrderColumn];
            $components = $this->blocks[$type]['components'];

            // Find the model by order or create a new one
            $foreignModel = $model->{$this->getName()}()->where($this->foreignOrderColumn, $order)->first() ?: new $foreignModelClassname();

            $newRequest = new Request();
            $newRequest->merge($item);

            // Save the type column with the new type
            $foreignModel->{$this->foreignTypeColumn} = $type;
            $foreignModel->{$this->foreignOrderColumn} = $order;

            // Save the fields of this blocks to the model
            foreach ($components as $component) {
                $component->save($foreignModel, $newRequest);
            }

            // Save the foreign model to the relation on the current model
            $model->{$this->getName()}()->save($foreignModel);
        }
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $foreignModels = $model->{$this->getName()}()->orderBy($this->foreignOrderColumn)->get();
        $collection = [];

        foreach ($foreignModels as $foreignModel) {

            $type = $foreignModel->{$this->foreignTypeColumn};

            if (isset($this->blocks[$type])) {
                $collection[] = new ContentBlockResource($foreignModel, $this->blocks[$type]['components'], [$this->foreignTypeColumn, $this->foreignOrderColumn,]);
            }
        }

        $attributes[$this->getName()] = $collection;
    }
}
