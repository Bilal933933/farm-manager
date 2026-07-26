<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\LandSeason;

class UpdateLandSeason
{
    public function execute(LandSeason $season, array $data): LandSeason
    {
        $season->update($data);

        return $season;
    }
}
