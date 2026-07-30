<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\LandSeason;

class DeleteLandSeason
{
    public function execute(LandSeason $season): void
    {
        if (in_array($season->status, [SeasonStatus::Completed, SeasonStatus::Cancelled], true)) {
            throw new \RuntimeException('لا يمكن حذف موسم في حالة "منتهي" أو "ملغي".');
        }

        $season->delete();
    }
}
