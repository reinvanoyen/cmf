<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use ReinVanOyen\Cmf\Support\Str as _Str;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasItemGrammar;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasTooltip;
use ReinVanOyen\Cmf\Traits\HasValidation;

/**
 * Class JsonField
 * @package ReinVanOyen\Cmf\Components
 */
class JsonField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;
    use HasItemGrammar;
    use HasTooltip;

    /**
     * @var array $components
     */
    private $components;

    /**
     * JsonField constructor.
     * @param string $name
     * @param array $components
     */
    public function __construct(string $name, array $components)
    {
        $this->name($name);
        $this->label(_Str::labelify($name));

        $this->singular(Str::lower(Str::singular($this->getName())));
        $this->plural(Str::lower(Str::singular($this->getName())));

        $this->components = $components;
        $this->export('components', $this->components);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'json-field';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        if ($request->has($this->getName())) {
            $model->{$this->getName()} = $request->get($this->getName());
        }
    }
}
