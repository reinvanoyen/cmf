<?php

namespace ReinVanOyen\Cmf\Tests\Component;

use ReinVanOyen\Cmf\Contracts\Makeable;
use ReinVanOyen\Cmf\MakeableStorage;
use ReinVanOyen\Cmf\Tests\TestCase;

class MakeableStorageTest extends TestCase
{
    private function createMakeableStorage()
    {
        return app(MakeableStorage::class);
    }

    public function testIfMakeableGetsFromStorage()
    {
        $sut = $this->createMakeableStorage();

        $makeable = $this->createMock(Makeable::class);
        $makeable->expects($this->once())->method('setId');
        $sut->store($makeable);
    }

    public function testIfMakeableIsFetchable()
    {
        $sut = $this->createMakeableStorage();

        // Add a makeable
        $makeable = $this->createMock(Makeable::class);
        $sut->store($makeable);

        $this->assertEquals(1, $sut->getLastCreatedId());
        $this->assertEquals($makeable, $sut->get(1));

        // Add another makeable
        $makeable2 = $this->createMock(Makeable::class);
        $sut->store($makeable2);

        $this->assertEquals(2, $sut->getLastCreatedId());
        $this->assertEquals($makeable2, $sut->get(2));
    }
}
