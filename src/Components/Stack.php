<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Action\Index;

class Stack extends Compound
{
    /**
     * Stack constructor.
     * @param array $components
     */
    public function __construct(array $components)
    {
        parent::__construct($components);
        $this->export('direction', 'horizontal');
        $this->export('gapless', false);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'stack';
    }

    /**
     * @return $this
     */
    public function horizontal()
    {
        $this->export('direction', 'horizontal');
        return $this;
    }

    /**
     * @return $this
     */
    public function vertical()
    {
        $this->export('direction', 'vertical');
        return $this;
    }

    /**
     * @return $this
     */
    public function gapless()
    {
        $this->export('gapless', true);
        return $this;
    }

    /**
     * @param array $grid
     * @return $this
     */
    public function grid(array $grid)
    {
        $this->export('grid', $grid);
        return $this;
    }
}
