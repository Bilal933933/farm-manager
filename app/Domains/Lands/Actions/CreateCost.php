<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;

class CreateCost
{
    public function __construct(
        private readonly CalculateActualCost $calculateActualCost,
    ) {}

    public function execute(array $data): Cost
    {
        $cost = Cost::create($data);

        if ($cost->land_season_id) {
            $this->calculateActualCost->execute($cost->landSeason);
        }

        return $cost;
    }
}
