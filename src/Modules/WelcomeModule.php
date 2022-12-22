<?php

namespace ReinVanOyen\Cmf\Modules;

use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\Dashboard;
use ReinVanOyen\Cmf\Components\Section;
use ReinVanOyen\Cmf\Components\Stack;
use ReinVanOyen\Cmf\Components\TextLiteral;
use ReinVanOyen\Cmf\Module;

class WelcomeModule extends Module
{
    /**
     * @return string
     */
    protected function title(): string
    {
        return trans('cmf::snippets.welcome');
    }

    /**
     * @return string
     */
    public function id(): string
    {
        return 'welcome';
    }

    /**
     * @return string
     */
    protected function icon()
    {
        return 'waving_hand';
    }

    /**
     * @return Action
     */
    public function index(): Action
    {
        return Dashboard::make([
            Stack::make([
                Section::make([
                    TextLiteral::make(trans('cmf::snippets.welcome_title'))
                        ->style('primary'),
                    TextLiteral::make(trans('cmf::snippets.welcome_text')),
                ]),
                Section::make([
                    Stack::make([
                        TextLiteral::make('Github')
                            ->url('https://github.com/reinvanoyen/cmf'),
                        TextLiteral::make('Issues')
                            ->url('https://github.com/reinvanoyen/cmf/issues'),
                        TextLiteral::make('Laravel Docs')
                            ->url('https://laravel.com/docs'),
                    ])->vertical()->gapless(),
                ])->title(trans('cmf::snippets.useful_resources')),
            ]),
        ]);
    }
}
