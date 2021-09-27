<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class TextToSlugField extends TextField
{
    /**
     * @var string $slugName
     */
    private $slugName;

    /**
     * TextToSlugField constructor.
     * @param string $name
     * @param string $slugName
     */
    public function __construct(string $name, string $slugName)
    {
        parent::__construct($name);
        $this->slugName = $slugName;
        $this->export('slugName', $this->slugName);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'text-to-slug-field';
    }

    /**
     * @param string $slugPrefix
     * @return $this
     */
    public function slugPrefix(string $slugPrefix)
    {
        $this->export('slugPrefix', $slugPrefix);
        return $this;
    }


    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
        $attributes[$this->slugName] = $model->{$this->slugName};
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        parent::save($model, $request);

        $model->{$this->slugName} = $request->input($this->slugName);
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        if (in_array('required', $validationRules)) {
            $validationRules[$this->slugName] = 'required';
        }

        return parent::registerValidationRules($validationRules);
    }
}
