<?php

namespace ReinVanOyen\Cmf\Components;

class Dropdown extends Component
{
    /**
     * @var array $links
     */
    private $links = [];

    /**
     * @return string
     */
    public function type(): string
    {
        return 'dropdown';
    }

    /**
     * Dropdown constructor.
     * @param string $text
     */
    public function __construct(string $text)
    {
        $this->export('text', $text);
    }

    /**
     * @param string $text
     * @param string $path
     * @return $this
     */
    public function link(string $text, string $path)
    {
        $this->links[] = [$text, $path,];
        $this->export('links', $this->links);
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
