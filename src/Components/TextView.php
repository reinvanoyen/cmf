<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;

class TextView extends Component
{
    use HasName;
    use HasLabel;

    /**
     * @var string $urlField
     */
    private $urlField;

    /**
     * @return string
     */
    public function type(): string
    {
        return 'text-view';
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
     * @return $this
     */
    public function copyable()
    {
        $this->export('copyable', true);
        return $this;
    }

    /**
     * @param int $maxLength
     * @param string $suffix
     * @return $this
     */
    public function truncate(int $maxLength, string $suffix = '…')
    {
        $this->export('truncateLength', $maxLength);
        $this->export('truncateSuffix', $suffix);
        return $this;
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};

        if ($this->urlField) {
            $attributes[$this->getName().'_url'] = $model->{$this->urlField};
        }
    }
}
