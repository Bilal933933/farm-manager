<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\LandSeason;

class UpdateLandSeason
{
    public function execute(LandSeason $season, array $data): LandSeason
    {
        if (in_array($season->status, [SeasonStatus::Completed, SeasonStatus::Cancelled], true)) {
            throw new \RuntimeException('لا يمكن تعديل موسم في حالة "منتهي" أو "ملغي".');
        }

        unset($data['status']);

        $season->update($data);

        return $season->fresh();
    }
}
