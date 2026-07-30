<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\LandSeason;

class StartSeasonAction
{
    public function execute(LandSeason $season, ?string $plantingDate = null): LandSeason
    {
        if ($season->status !== SeasonStatus::Upcoming) {
            throw new \RuntimeException('لا يمكن بدء موسم إلا إذا كان في حالة "قادم".');
        }

        $hasActive = LandSeason::where('land_id', $season->land_id)
            ->where('id', '!=', $season->id)
            ->where('status', SeasonStatus::Active)
            ->exists();

        if ($hasActive) {
            throw new \RuntimeException('يوجد موسم نشط بالفعل لهذه الأرض.');
        }

        $data = ['status' => SeasonStatus::Active];

        if ($plantingDate !== null) {
            $data['planting_date'] = $plantingDate;
        }

        $season->update($data);

        return $season->fresh();
    }
}
