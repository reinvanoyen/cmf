<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;

class Foreign extends Compound
{
    /**
     * @var string $relationship
     */
    private $relationship;

    /**
     * @param string $relationship
     * @param array $components
     */
    public function __construct(string $relationship, array $components)
    {
        $this->relationship = $relationship;

        parent::__construct($components);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'foreign';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     * @return void
     * @throws \ReinVanOyen\Cmf\Exceptions\CouldntGuessMetaException
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $foreignModel = $model->{$this->relationship};

        if (! $foreignModel) {
            return;
        }

        $modelResource = new ModelResource($foreignModel);

        foreach ($this->components as $component) {
            $component->provision($modelResource, $attributes);
        }
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        $foreignModel = $model->{$this->relationship};

        if (!$foreignModel) {
            $foreignModel = $model->{$this->relationship}()->make();
        }

        foreach ($this->components as $component) {
            $component->save($foreignModel, $request);
        }

        $foreignModel->save();

        $model->{$this->relationship}()->associate($foreignModel);
    }
}
