<?php

namespace ReinVanOyen\Cmf\Components;

class Link extends Component
{
    /**
     * Link constructor.
     * @param string $text
     * @param string $actionPath
     */
    public function __construct(string $text, string $actionPath = '')
    {
        $this->export('text', $text);
        if ($actionPath) {
            $this->export('action', $actionPath);
        }
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'link';
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
     * @return $this
     */
    public function back()
    {
        $this->export('back', true);
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
