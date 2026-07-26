<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\LandContract;

class CreateLandContract
{
    public function execute(array $data): LandContract
    {
        return LandContract::create($data);
    }
}
