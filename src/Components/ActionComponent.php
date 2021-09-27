<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Action\Action;

class ActionComponent extends Component
{
    /**
     * @var Action $action
     */
    private $action;

    /**
     * ActionComponent constructor.
     * @param Action $action
     */
    public function __construct(Action $action)
    {
        $this->action = $action;
        $this->export('action', $this->action);
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
     * @return string
     */
    public function type(): string
    {
        return 'action-component';
    }
}
