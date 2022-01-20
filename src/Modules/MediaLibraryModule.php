<?php

namespace ReinVanOyen\Cmf\Modules;

use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\ViewMediaDirectory;
use ReinVanOyen\Cmf\Module;

class MediaLibraryModule extends Module
{
    /**
     * @return string
     */
    protected function title(): string
    {
        return 'Media library';
    }

    /**
     * @return string
     */
    public function id(): string
    {
        return 'media';
    }

    /**
     * @return string
     */
    protected function icon()
    {
        return 'photo_library';
    }

    /**
     * @return Action
     */
    public function index(): Action
    {
        return ViewMediaDirectory::make();
    }

    /**
     * @return array
     */
    public function exportAll(): array
    {
        $this->export('fileLabels', config('cmf.media_library_file_labels', []));
        return parent::exportAll();
    }
}
