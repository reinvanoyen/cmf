<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\MediaFileResource;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\HasItemGrammar;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasTooltip;
use ReinVanOyen\Cmf\Traits\HasValidation;

class GalleryField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;
    use HasItemGrammar;
    use HasTooltip;

    /**
     * @var string $orderColumn
     */
    private $orderColumn;

    /**
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->name($name);
        $this->plural($name);
        $this->label(Str::labelify($name));
        $this->export('fileLabels', config('cmf.media_library_file_labels', []));
    }

    /**
     * @param string $orderColumn
     * @return $this
     */
    public function orderColumn(string $orderColumn)
    {
        $this->orderColumn = $orderColumn;
        $this->export('orderColumn', $this->orderColumn);
        return $this;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'gallery-field';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $mediaFiles = ($this->orderColumn ?
            $model->{$this->getName()}()->orderBy($this->orderColumn)->get() :
            $model->{$this->getName()}
        );

        $collection = [];

        foreach ($mediaFiles as $mediaFile) {
            $collection[] = new MediaFileResource($mediaFile);
        }

        $attributes[$this->getName()] = $collection;
    }

    /**
     * @param Model $model
     * @param $request
     * @return void
     */
    public function save(Model $model, $request)
    {
        if ($request->has($this->getName())) {

            $files = $request->get($this->getName());
            $fileIds = ($files ? (is_array($files) ? $files : explode(',', $files)) : []);
            $fileCount = count($fileIds);

            if ($this->orderColumn && $fileCount) {
                $pivot = array_map(function ($order) {
                    return [$this->orderColumn => $order,];
                }, range(1, $fileCount));
                $fileIds = array_combine($fileIds, $pivot);
            }

            $model::saved(function ($model) use ($fileIds) {
                $model->{$this->name}()->sync($fileIds);
            });
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
