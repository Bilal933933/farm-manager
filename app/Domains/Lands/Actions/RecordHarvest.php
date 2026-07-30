<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\Harvest;
use App\Domains\Lands\Models\LandSeason;

class RecordHarvest
{
    public function execute(array $data): Harvest
    {
        $season = LandSeason::findOrFail($data['land_season_id']);

        if (! in_array($season->status, [SeasonStatus::Active, SeasonStatus::Harvesting], true)) {
            throw new \RuntimeException('لا يمكن تسجيل حصاد لموسم في حالة "منتهي" أو "ملغي" أو "قادم".');
        }

        return Harvest::create($data);
    }
}
