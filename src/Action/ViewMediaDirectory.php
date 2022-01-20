<?php

namespace ReinVanOyen\Cmf\Action;

class ViewMediaDirectory extends Action
{
    /**
     * ViewMediaDirectory constructor.
     */
    public function __construct()
    {
        $this->export('fileLabels', config('cmf.media_library_file_labels', []));
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'view-media-directory';
    }
}
