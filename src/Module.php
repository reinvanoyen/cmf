<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use JsonSerializable;
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

    protected function icon()
    {
        return 'layers';
    }

    /**
     * @return Action
     */
    abstract public function index(): Action;

    /**
     * @param string $name
     * @param Request $request
     * @return mixed
     */
    final public function getAction(Request $request, string $name): ?Action
    {
        if ($action = $this->$name($request)) {
            return $action;
        }

        return null;
    }

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
            'path' => [
                'module' => $this->id(),
            ],
        ];
    }
}
