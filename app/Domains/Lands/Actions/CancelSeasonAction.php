<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\LandSeason;

class CancelSeasonAction
{
    public function execute(LandSeason $season): LandSeason
    {
        if ($season->status !== SeasonStatus::Upcoming) {
            throw new \RuntimeException('لا يمكن إلغاء إلا المواسم في حالة "قادم".');
        }

        $season->update(['status' => SeasonStatus::Cancelled]);

        return $season->fresh();
    }
}
