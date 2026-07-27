<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\LandSeason;

class CalculateActualCost
{
    public function __construct(
        private readonly CalculateSeasonFinancials $calculateSeasonFinancials,
    ) {}

    public function execute(LandSeason $season): void
    {
        $this->calculateSeasonFinancials->forSeason($season);
    }
}
