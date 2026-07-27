<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;

class UpdateCost
{
    public function __construct(
        private readonly CalculateActualCost $calculateActualCost,
    ) {}

    public function execute(Cost $cost, array $data): Cost
    {
        $oldSeasonId = $cost->land_season_id;

        $cost->update($data);

        if ($oldSeasonId) {
            $this->calculateActualCost->execute($cost->landSeason()->withTrashed()->first() ?? $cost->landSeason);
        }

        if ($cost->land_season_id && $cost->land_season_id !== $oldSeasonId) {
            $this->calculateActualCost->execute($cost->landSeason);
        }

        return $cost;
    }
}
