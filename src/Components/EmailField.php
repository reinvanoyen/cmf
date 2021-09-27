<?php

namespace ReinVanOyen\Cmf\Components;

class EmailField extends TextField
{
    public function type(): string
    {
        return 'email-field';
    }
}
