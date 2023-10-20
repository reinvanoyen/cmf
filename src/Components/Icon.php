<?php

namespace ReinVanOyen\Cmf\Components;

class Icon extends Component
{
    /**
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->export('name', $name);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'icon';
    }

    /**
     * @param string $actionPath
     * @return $this
     */
    public function to(string $actionPath)
    {
        $this->export('action', $actionPath);
        return $this;
    }

    /**
     * @param mixed $style
     * @return $this
     */
    public function style($style)
    {
        $this->export('style', $style);
        return $this;
    }
}
