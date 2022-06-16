<?php

namespace ReinVanOyen\Cmf\Action;

class Dashboard extends Action
{
    /**
     * Dashboard constructor.
     * @param array $components
     */
    public function __construct(array $components = [])
    {
        $this->components($components);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'dashboard';
    }
}
