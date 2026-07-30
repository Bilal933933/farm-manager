<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\LandSeason;

class BeginHarvestAction
{
    public function execute(LandSeason $season): LandSeason
    {
        if ($season->status !== SeasonStatus::Active) {
            throw new \RuntimeException('لا يمكن بدء الحصاد إلا إذا كان الموسم في حالة "نشط".');
        }

        $season->update(['status' => SeasonStatus::Harvesting]);

        return $season->fresh();
    }
}
