<?php

namespace ReinVanOyen\Cmf\Tests\Component;

use ReinVanOyen\Cmf\Cmf;
use ReinVanOyen\Cmf\Module;
use ReinVanOyen\Cmf\Tests\Fixtures\Modules\UserModule;
use ReinVanOyen\Cmf\Tests\TestCase;

class CmfTest extends TestCase
{
    private function createCmf()
    {
        return app(Cmf::class);
    }

    public function testIfVersionIsValid()
    {
        $this->assertIsString($this->createCmf()->getVersion());
    }

    public function testIfApiIsUnauthorized()
    {
        $response = $this->withExceptionHandling()
            ->get('/cmf/api/modules');

        $response->assertStatus(401);
    }

    public function testModulesCount()
    {
        $cmf = $this->createCmf();
        $this->assertCount(0, $cmf->getModules());

        $cmf->registerModule(UserModule::class);
        $this->assertCount(1, $cmf->getModules());
    }

    public function testIfAllModulesAreInstantiated()
    {
        $cmf = $this->createCmf();

        $cmf->registerModule(UserModule::class);
        $modules = $cmf->getModules();

        foreach ($modules as $module) {
            $this->assertInstanceOf(Module::class, $module);
            $this->assertIsString($module->id());
        }
    }

    public function testIfModulesAreCorrectlyStored()
    {
        $cmf = $this->createCmf();
        $cmf->registerModule(UserModule::class);
        $modules = $cmf->getModules();

        foreach ($modules as $module) {
            $this->assertEquals(
                $module,
                $cmf->getModule($module->id())
            );
        }
    }
}
