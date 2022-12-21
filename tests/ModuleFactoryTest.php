<?php

namespace ReinVanOyen\Cmf\Tests\Component;

use ReinVanOyen\Cmf\Factories\ModuleFactory;
use ReinVanOyen\Cmf\Tests\Fixtures\Modules\UserModule;
use ReinVanOyen\Cmf\Tests\TestCase;

class ModuleFactoryTest extends TestCase
{
    private function createModuleFactory()
    {
        return app(ModuleFactory::class);
    }

    public function testIfMakingFromValidClassReturnsModule()
    {
        $sut = $this->createModuleFactory();

        $module = $sut->make(UserModule::class);

        $this->assertInstanceOf(UserModule::class, $module);
        $this->assertIsString($module->id());
        $this->assertEquals('users', $module->id());
    }

    public function testIfMakingFromModuleReturnsModule()
    {
        $sut = $this->createModuleFactory();

        $userModule = new UserModule();
        $module = $sut->make($userModule);

        $this->assertEquals($module, $userModule);
        $this->assertInstanceOf(UserModule::class, $module);
        $this->assertIsString($module->id());
        $this->assertEquals('users', $module->id());
    }

    public function testIfMakingFromInvalidClassReturnsNull()
    {
        $sut = $this->createModuleFactory();
        $module = $sut->make('AnInvalidModule');
        $this->assertNull($module);
    }
}
