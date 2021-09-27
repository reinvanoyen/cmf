<?php

namespace ReinVanOyen\Cmf\Action;

use ReinVanOyen\Cmf\Contracts\{Exportable, Makeable};
use ReinVanOyen\Cmf\Module;
use ReinVanOyen\Cmf\Traits\CanExport;
use ReinVanOyen\Cmf\Traits\CanBeMade;

abstract class Action implements Exportable, Makeable, \JsonSerializable
{
    use CanExport;
    use CanBeMade;

    /**
     * @var Module $module
     */
    private $moduleId;

    /**
     * @var string $id
     */
    private $id;

    /**
     * @param string $id
     */
    final public function id(string $id)
    {
        $this->id = $id;
    }

    /**
     * @param Module $module
     */
    final public function module(string $moduleId)
    {
        $this->moduleId = $moduleId;

        $this->export('path', [
            'module' => $this->moduleId,
            'action' => $this->id,
        ]);
    }

    /**
     * @param array $components
     * @return $this
     */
    final public function header(array $components)
    {
        $this->export('header', $components);
        return $this;
    }

    /**
     * @param string $title
     * @return $this
     */
    final public function title(string $title)
    {
        $this->export('title', $title);
        return $this;
    }

    /**
     * @param array $params
     * @return $this
     */
    final public function params(array $params)
    {
        $this->export('params', $params);
        return $this;
    }
}
