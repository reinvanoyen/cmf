<?php

namespace ReinVanOyen\Cmf\Components;

use ReinVanOyen\Cmf\Traits\HasLabel;

class Modal extends Compound
{
    use HasLabel;

    public function __construct(string $title, array $components = [])
    {
        $this->title($title);
        parent::__construct($components);
    }

    /**
     * @param string $title
     * @return $this
     */
    public function title(string $title)
    {
        $this->export('title', $title);
        return $this;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'modal';
    }
}
