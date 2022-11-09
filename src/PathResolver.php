<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Action\Action;

class PathResolver
{
    /**
     * @var Cmf $cmf
     */
    private $cmf;

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
     * Get a module from the CMF by module id
     *
     * @param string $moduleId
     * @return Module|null
     */
    public function module(string $moduleId): ?Module
    {
        return $this->cmf->getModule($moduleId);
    }

    /**
     * Get an action by module id and action id. Also pass the request.
     *
     * @param Request $request
     * @param string $moduleId
     * @param string $actionId
     * @return Action|null
     */
    public function action(Request $request, string $moduleId, string $actionId): ?Action
    {
        $module = $this->module($moduleId);

        // No module found?
        if (! $module) {
            return null;
        }

        $action = (method_exists($module, $actionId) ? $module->$actionId($request) : null);

        // No action found?
        if (! $action) {
            return null;
        }

        // Set the action id to the action
        $action->id($actionId);

        // Give the action the module id
        $action->module($moduleId);

        return $action;
    }
}
