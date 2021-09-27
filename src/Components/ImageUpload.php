<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasValidation;

class ImageUpload extends Component
{
    use HasValidation;
    use HasLabel;
    use HasName;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'image-upload';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->getFirstMediaUrl($this->getName());
    }

    /**
     * @param Model $model
     * @param Request $request
     */
    public function save(Model $model, Request $request)
    {
        $fileAction = $request->input($this->getName().'_action');

        if ($fileAction === 'create' && $request->hasFile($this->getName())) {

            $model->addMediaFromRequest($this->getName())
                ->toMediaCollection($this->getName());

        } else if ($fileAction === 'delete') {

            $media = $model->getFirstMedia($this->getName());

            if ($media) {
                $media->delete();
            }

        } else if ($fileAction === 'keep') {

            // For reference
        }
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        $validationRules[$this->getName()] = $this->validationRules;

        return $validationRules;
    }
}
