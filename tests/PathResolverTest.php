<?php

namespace ReinVanOyen\Cmf\Tests\Component;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Cmf;
use ReinVanOyen\Cmf\Module;
use ReinVanOyen\Cmf\PathResolver;
use ReinVanOyen\Cmf\Tests\Fixtures\Modules\UserModule;
use ReinVanOyen\Cmf\Tests\TestCase;

class PathResolverTest extends TestCase
{
    private $cmf;

    private function createPathResolver()
    {
        $this->cmf = app(Cmf::class);
        return app(PathResolver::class);
    }

    public function testIfModulePathCanBeResolved()
    {
        $sut = $this->createPathResolver();

        $this->cmf->registerModule(UserModule::class);

        $module = $sut->module('users');
        $this->assertInstanceOf(Module::class, $module);
    }

    public function testIfActionPathCanBeResolved()
    {
        $sut = $this->createPathResolver();

        $this->cmf->registerModule(UserModule::class);

        $action = $sut->action(app(Request::class), 'users', 'index');
        $this->assertInstanceOf(Action::class, $action);
    }

    public function testIfInvalidModulePathReturnsNull()
    {
        $sut = $this->createPathResolver();

        $this->cmf->registerModule(UserModule::class);

        $module = $sut->module('invalid');
        $this->assertNull($module);
    }

    public function testIfInvalidActionPathReturnsNull()
    {
        $sut = $this->createPathResolver();

        $this->cmf->registerModule(UserModule::class);

        $action = $sut->action(app(Request::class), 'users', 'invalid');
        $this->assertNull($action);
    }
}
