<?php

namespace ReinVanOyen\Cmf\Components;

class PasswordField extends TextField
{
    public function type(): string
    {
        return 'password-field';
    }
}
