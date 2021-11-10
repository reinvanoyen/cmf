<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\MediaFileResource;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class Card extends Compound
{
    /**
     * @var string $titleField
     */
    private $titleField;

    /**
     * @var string $photoName
     */
    private $photoName;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'card';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        parent::provision($model, $attributes);

        if ($this->titleField) {
            $attributes[$this->titleField] = $model->{$this->titleField};
        }

        if ($this->photoName) {
            $attributes[$this->photoName] = new MediaFileResource($model->{$this->photoName});
        }
    }

    /**
     * @param string $titleField
     * @return $this
     */
    public function title(string $titleField)
    {
        $this->titleField = $titleField;
        $this->export('titleField', $this->titleField);
        return $this;
    }

    /**
     * @param string $photoName
     * @return $this
     */
    public function photo(string $photoName)
    {
        $this->photoName = $photoName;
        $this->export('photo', $this->photoName);
        return $this;
    }
}
