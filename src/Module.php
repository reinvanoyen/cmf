<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\Str;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Traits\CanExport;

abstract class Module implements \JsonSerializable
{
    use CanExport;

    /**
     * @return string
     */
    abstract protected function title(): string;

    /**
     * @return string
     */
    public function id(): string
    {
        return Str::slug($this->title(), '-');
    }

    /**
     * @return bool
     */
    protected function inNavigation(): bool
    {
        return true;
    }

    /**
     * @return string
     */
    protected function icon()
    {
        return 'layers';
    }

    /**
     * @return Action
     */
    abstract public function index(): Action;

    /**
     * @return array
     */
    public function submodules(): array
    {
        return [];
    }

    /**
     * @param array $modules
     * @return array
     */
    final public static function makeModules(array $modules): array
    {
        return array_map(function ($module) {
            if (is_string($module)) {
                return app($module);
            }
            if ($module instanceof  Module) {
                return $module;
            }
            return null;
        }, $modules);
    }

    /**
     * @return array
     */
    public function exportAll(): array
    {
        $this->exports['id'] = $this->id();
        $this->exports['title'] = $this->title();
        $this->exports['icon'] = $this->icon();
        $this->exports['inNavigation'] = $this->inNavigation();
        $this->exports['path'] = [
            'module' => $this->id(),
        ];
        $this->exports['url'] = url('admin/'.$this->id());
        $this->exports['submodules'] = self::makeModules($this->submodules());

        return $this->exports;
    }
}
