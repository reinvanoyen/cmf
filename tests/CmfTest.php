<?php

namespace ReinVanOyen\Cmf\Tests\Component;

use ReinVanOyen\Cmf\Cmf;
use ReinVanOyen\Cmf\Tests\TestCase;

class CmfTest extends TestCase
{
    public function testTitleConfiguation()
    {
        $this->assertEquals('Test cmf', app(Cmf::class)->getTitle());
    }

    public function testIfApiIsUnauthorized()
    {
        $response = $this->withExceptionHandling()
            ->get('/cmf/api/modules');

        $response->assertStatus(401);
    }

    public function testModulesCount()
    {
        $this->assertCount(1, app(Cmf::class)->getModules());
    }
}
