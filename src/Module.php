<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use JsonSerializable;
use phpDocumentor\Reflection\Types\Boolean;
use ReinVanOyen\Cmf\Action\Action;

abstract class Module implements JsonSerializable
{
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
     *
     * @return mixed|void
     */
    public function jsonSerialize()
    {
        return [
            'title' => $this->title(),
            'id' => $this->id(),
            'icon' => $this->icon(),
            'inNavigation' => $this->inNavigation(),
            'path' => [
                'module' => $this->id(),
            ],
            'url' => url('admin/'.$this->id()),
        ];
    }
}
