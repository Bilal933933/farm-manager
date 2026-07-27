<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\LandSeason;

class DeleteCost
{
    public function __construct(
        private readonly CalculateActualCost $calculateActualCost,
    ) {}

    public function execute(Cost $cost): void
    {
        $seasonId = $cost->land_season_id;

        $cost->delete();

        if ($seasonId) {
            $season = LandSeason::withTrashed()->find($seasonId);

            if ($season) {
                $this->calculateActualCost->execute($season);
            }
        }
    }
}
