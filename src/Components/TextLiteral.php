<?php

declare(strict_types=1);

namespace ReinVanOyen\Cmf\Components;

/**
 * Class TextLiteral
 * @package ReinVanOyen\Cmf\Components
 */
class TextLiteral extends Component
{
    /**
     * @var string $text
     */
    private $text;

    /**
     * TextLiteral constructor.
     * @param string $text
     */
    public function __construct(string $text)
    {
        $this->text = $text;
        $this->export('text', $this->text);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'text-literal';
    }

    /**
     * @param string $style
     * @return $this
     */
    public function style(string $style)
    {
        $this->export('style', $style);
        return $this;
    }

    /**
     * @param string $url
     * @return $this
     */
    public function url(string $url)
    {
        $this->export('url', $url);
        return $this;
    }
}
