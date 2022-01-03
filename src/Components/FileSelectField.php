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
     * FileSelectField constructor.
     * @param string $name
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
     * @param mixed $style
     * @return $this
     */
    public function style($style)
    {
        $this->export('style', $style);
        return $this;
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
        if ($request->has($this->getName())) {

            $mediaFile = MediaFile::find($request->input($this->getName()));

            if ($mediaFile) {
                $model->{$this->getName()}()->associate($mediaFile);
            }
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
