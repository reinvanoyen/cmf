<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Traits\CanRedirect;

class ExecuteLink extends Component
{
    use CanRedirect;

    /**
     * Link constructor.
     * @param string $text
     * @param string $actionPath
     */
    public function __construct(string $text, string $actionPath)
    {
        $this->export('text', $text);
        $this->export('action', $actionPath);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'execute-link';
    }

    /**
     * @param string $message
     * @return $this
     */
    public function notify(string $message)
    {
        $this->export('notification', $message);
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

    /**
     * @param array $components
     * @return $this
     */
    public function ask(array $components)
    {
        $this->export('components', $components);
        return $this;
    }
}
