<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\LandSeason;

class CalculateActualCost
{
    public function execute(LandSeason $season): void
    {
        $total = Cost::where('land_season_id', $season->id)->sum('amount');

        $season->update(['actual_cost' => $total]);
    }
}
