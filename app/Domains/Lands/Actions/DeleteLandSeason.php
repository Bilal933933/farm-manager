<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\LandSeason;

class DeleteLandSeason
{
    public function execute(LandSeason $season): void
    {
        $season->delete();
    }
}
