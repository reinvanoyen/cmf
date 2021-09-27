<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Action\Action;

class ActionComponent extends Component
{
    /**
     * @var Action $childAction
     */
    private $childAction;

    /**
     * ActionComponent constructor.
     * @param Action $childAction
     */
    public function __construct(Action $childAction)
    {
        $this->childAction = $childAction;
        $this->export('action', $this->childAction);
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
