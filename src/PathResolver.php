<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Action\Action;

class PathResolver
{
    /**
     * PathResolver constructor.
     * @param Cmf $cmf
     */
    public function __construct(Cmf $cmf)
    {
        $this->cmf = $cmf;
    }

    /**
     * @return array
     */
    public function modules(): array
    {
        return $this->cmf->getModules();
    }

    /**
     * @param string $moduleId
     * @return Module|null
     */
    public function module(string $moduleId): ?Module
    {
        return $this->cmf->getModule($moduleId);
    }

    /**
     * @param string $moduleId
     * @param string $actionId
     * @return Action|null
     */
    public function action(Request $request, string $moduleId, string $actionId): ?Action
    {
        $module = $this->module($moduleId);

        if (! $module) {
            return null;
        }

        $action = $module->getAction($request, $actionId);

        if (! $action) {
            return null;
        }

        $action->id($actionId);
        $action->module($moduleId);

        return $action;
    }

    public function execute(Request $request, string $moduleId, string $actionId, string $executeId)
    {
        if ($action = $this->action($moduleId, $actionId)) {
            return $action->$executeId($request);
        }

        return null;
    }
}
