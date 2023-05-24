<?php

declare(strict_types=1);

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;

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
     * @var string $urlField
     */
    private $urlField;

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
     * @return $this
     */
    public function url($url = true)
    {
        if ($url !== true) {
            $this->urlField = $url;
        }
        $this->export('url', $url);
        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        if ($this->urlField) {
            $attributes[$this->getId().'_url'] = $model->{$this->urlField};
        }
    }
}
