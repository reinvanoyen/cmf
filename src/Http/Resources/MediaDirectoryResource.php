<?php

namespace ReinVanOyen\Cmf\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MediaDirectoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'created_at' => $this->created_at->format('j F Y H:i'),
            'updated_at' => $this->updated_at->format('j F Y H:i'),
            'directory' => $this->directory,
        ];
    }
}
