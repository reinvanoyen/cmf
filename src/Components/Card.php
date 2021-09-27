<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class Card extends Compound
{
    /**
     * @var string $titleField
     */
    private $titleField;

    /**
     * @var string $photoCollection
     */
    private $photoCollection;

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

        if ($this->photoCollection) {
            $attributes[$this->photoCollection] = $model->getFirstMediaUrl($this->photoCollection);
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
     * @param string $photoCollection
     * @return $this
     */
    public function photo(string $photoCollection)
    {
        $this->photoCollection = $photoCollection;
        $this->export('photoCollection', $this->photoCollection);
        return $this;
    }
}
