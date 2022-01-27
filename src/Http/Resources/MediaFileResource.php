<?php

namespace ReinVanOyen\Cmf\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MediaFileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $disk = config('cmf.media_library_disk');
        $storage = Storage::disk($disk);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'filename' => $this->filename,
            'size' => $this->size,
            'disk' => $this->disk,
            'conversions_disk' => $this->conversions_disk,
            'mime_type' => $this->mime_type,
            'label' => $this->label,
            'copyright' => $this->copyright,
            'description' => $this->description,
            'directory' => $this->directory,
            'created_at' => $this->created_at->format('F j Y H:i'),
            'updated_at' => $this->updated_at->format('F j Y H:i'),
            'is_image' => $this->is_image,
            'url' => route('mediafile', ['id' => $this->id, 'filename' => $this->name,], true),
            'conversions' => [
                'thumb' => route('mediafileconversion', ['conversion' => 'cmf-thumb', 'id' => $this->id, 'filename' => $this->name,], true),
                'preview' => route('mediafileconversion', ['conversion' => 'cmf-preview', 'id' => $this->id, 'filename' => $this->name,], true),
                'contain' => route('mediafileconversion', ['conversion' => 'cmf-contain', 'id' => $this->id, 'filename' => $this->name,], true),
            ],
        ];
    }
}
