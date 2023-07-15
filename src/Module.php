<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\Str;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Factories\ModuleFactory;
use ReinVanOyen\Cmf\Traits\CanExport;
use ReinVanOyen\Cmf\Facades\Cmf;

abstract class Module implements \JsonSerializable
{
    use CanExport;

    /**
     * The title of the module
     *
     * @return string
     */
    abstract protected function title(): string;

    /**
     * The id of the module
     * By default this is the slugified title of the module
     *
     * @return string
     */
    public function id(): string
    {
        return Str::slug($this->title(), '-');
    }

    /**
     * Is the module visible in the navigation?
     *
     * @return bool
     */
    public function inNavigation(): bool
    {
        return true;
    }

    /**
     * Is the module available from the primary modules navigation?
     *
     * @return bool
     */
    public function inPrimaryNavigation(): bool
    {
        return true;
    }

    /**
     * Is the module available from the secondary user panel?
     *
     * @return bool
     */
    public function inSecondaryNavigation(): bool
    {
        return false;
    }

    /**
     * The icon of the module as a Material Icons string
     *
     * @return string
     */
    protected function icon()
    {
        return 'layers';
    }

    /**
     * The default (index) action of the module
     *
     * @return Action
     */
    abstract public function index(): Action;

    /**
     * The submodules of the module
     *
     * @return array
     */
    public function submodules(): array
    {
        return [];
    }

    /**
     * The export of the module
     * Here we define everything the API call will receive
     *
     * @return array
     */
    public function exportAll(): array
    {
        $this->exports['id'] = $this->id();
        $this->exports['title'] = $this->title();
        $this->exports['icon'] = $this->icon();
        $this->exports['path'] = [
            'module' => $this->id(),
        ];
        $this->exports['url'] = url(Cmf::getPath().'/'.$this->id());
        $this->exports['submodules'] = array_map(function($module) {
            return (new ModuleFactory())->make($module);
        }, $this->submodules());

        return $this->exports;
    }
}
