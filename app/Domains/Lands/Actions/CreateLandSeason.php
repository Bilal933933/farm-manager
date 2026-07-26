<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\LandSeason;

class CreateLandSeason
{
    public function execute(array $data): LandSeason
    {
        return LandSeason::create($data);
    }
}
