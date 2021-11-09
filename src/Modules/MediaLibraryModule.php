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
     * @return Action
     */
    public function index(): Action
    {
        return ViewMediaDirectory::make();
    }
}
