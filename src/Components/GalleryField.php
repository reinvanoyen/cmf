<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Http\Resources\ContentBlockResource;
use ReinVanOyen\Cmf\Http\Resources\MediaFileResource;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Models\MediaFile;
use ReinVanOyen\Cmf\RelationshipMetaGuesser;
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
     * @var string $fileRelationName
     */
    private $fileRelationName;

    /**
     * @var string $meta
     */
    private $meta;

    /**
     * GalleryField constructor.
     * @param string $name
     * @param string $fileRelationName
     * @param string|null $meta
     */
    public function __construct(string $name, string $fileRelationName, string $meta = null)
    {
        $this->name($name);
        $this->label(Str::labelify($name));

        $this->fileRelationName = $fileRelationName;

        $this->meta = $meta ?: RelationshipMetaGuesser::getMeta($this->getName());
        $this->singular($this->meta::getSingular());
        $this->plural($this->meta::getPlural());
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
        if ($this->orderColumn) {
            $foreignModels = $model->{$this->getName()}()->orderBy($this->orderColumn)->get();
        } else {
            $foreignModels = $model->{$this->getName()};
        }

        $collection = [];

        foreach ($foreignModels as $foreignModel) {
            $collection[] = new MediaFileResource($foreignModel->{$this->fileRelationName});
        }

        $attributes[$this->getName()] = $collection;
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        if ($request->has($this->getName())) {

            $files = $request->get($this->getName());
            $fileIds = ($files ? (is_array($files) ? $files : explode(',', $files)) : []);

            $model::saved(function ($model) use ($fileIds) {

                $foreignModelClassname = $this->meta::getModel();
                $i = 0;

                foreach ($model->{$this->name} as $item) {

                    if (isset($fileIds[$i])) {
                        // Update file
                        $mediaFile = MediaFile::find($fileIds[$i]);

                        $item->{$this->fileRelationName}()->associate($mediaFile);
                        $item->save();

                        // Store the order
                        if ($this->orderColumn) {
                            $item->{$this->orderColumn} = $i;
                        }

                    } else {

                        // Delete file
                        $item->delete();
                    }

                    $i++;
                }

                while(isset($fileIds[$i])) {

                    $mediaFile = MediaFile::find($fileIds[$i]);

                    $foreignModel = new $foreignModelClassname();
                    $foreignModel->{$this->fileRelationName}()->associate($mediaFile);

                    // Store the order
                    if ($this->orderColumn) {
                        $foreignModel->{$this->orderColumn} = $i;
                    }

                    // Save the foreign model to the relation on the current model
                    $model->{$this->getName()}()->save($foreignModel);
                    $i++;
                }
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
