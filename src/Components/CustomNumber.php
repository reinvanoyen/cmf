<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Traits\HasValidation;

class CustomNumber extends Component
{
    use HasValidation;

    /**
     * @var callable $name
     */
    private $load;

    /**
     * EnumField constructor.
     * @param callable $load
     */
    public function __construct(callable $load)
    {
        $this->load = $load;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'custom-number';
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
     * @param string $icon
     * @return $this
     */
    public function icon(string $icon)
    {
        $this->export('icon', $icon);
        return $this;
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
     * @param Request $request
     * @return mixed
     */
    public function apiLoad(Request $request)
    {
        $load = $this->load;
        return $load($request);
    }
}
