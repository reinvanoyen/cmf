<?php


namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\MediaFileResource;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Models\MediaFile;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasValidation;

class FileSelectField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;

    /**
     * EnumField constructor.
     * @param string $name
     * @param array $options
     */
    public function __construct(string $name)
    {
        $this->name($name);
        $this->label(Str::labelify($name));
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'file-select-field';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = new MediaFileResource($model->{$this->getName()});
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        if ($request->input($this->getName())) {
            $mediaFile = MediaFile::findOrFail($request->input($this->getName()));
            $model->{$this->getName()}()->associate($mediaFile);
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
