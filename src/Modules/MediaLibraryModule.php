<?php

namespace ReinVanOyen\Cmf\Modules;

use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\Create;
use ReinVanOyen\Cmf\Action\Index;
use ReinVanOyen\Cmf\Action\View;
use ReinVanOyen\Cmf\Action\ViewMediaDirectory;
use ReinVanOyen\Cmf\Components\FileUpload;
use ReinVanOyen\Cmf\Components\HasMany;
use ReinVanOyen\Cmf\Components\Link;
use ReinVanOyen\Cmf\Components\Section;
use ReinVanOyen\Cmf\Components\Stack;
use ReinVanOyen\Cmf\Components\TextField;
use ReinVanOyen\Cmf\Components\TextView;
use ReinVanOyen\Cmf\Meta\MediaDirectoryMeta;
use ReinVanOyen\Cmf\Meta\MediaFileMeta;
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
        return ViewMediaDirectory::make()
            ->header([
                Link::make('New directory', 'createDirectory')
                    ->style(['primary',]),
            ]);
    }

    /**
     * @return Action
     */
    public function directories(): Action
    {
        return Index::make(MediaDirectoryMeta::class, [
            TextView::make('name'),
        ])
            ->whereNull('media_directory_id')
            ->action('viewDirectory')
            ->header([
                Link::make('View files', 'files')
                    ->style(['secondary',]),
                Link::make('New directory', 'createDirectory')
                    ->style(['secondary',]),
                Link::make('Upload', 'upload')
                    ->style(['primary',]),
            ]);
    }

    /**
     * @return Action
     */
    public function media(): Action
    {
        return Index::make();
    }

    /**
     * @return Action
     */
    public function files(): Action
    {
        return Index::make(MediaFileMeta::class, [
            TextView::make('filename'),
            TextView::make('name'),
            TextView::make('disk'),
            TextView::make('mime_type'),
        ]);
    }

    /**
     * @return Action
     */
    public function upload(): Action
    {
        return Create::make(MediaFileMeta::class, [
            FileUpload::make(),
        ]);
    }

    /**
     * @return Action
     */
    public function createDirectory(): Action
    {
        return Create::make(MediaDirectoryMeta::class, [
            TextField::make('name')->validate(['required',]),
        ]);
    }

    /**
     * @return Action
     */
    public function createChildDirectory(): Action
    {
        return $this->createDirectory()
            ->attachTo('directory');
    }

    /**
     * @return Action
     */
    public function viewDirectory(): Action
    {
        return View::make(MediaDirectoryMeta::class, [
            HasMany::make('directories', [
                TextView::make('name'),
            ])
                ->meta(MediaDirectoryMeta::class),
        ])
            ->header([
                Link::make('New directory', 'createChildDirectory')
                    ->style(['primary',]),
            ]);
    }
}
