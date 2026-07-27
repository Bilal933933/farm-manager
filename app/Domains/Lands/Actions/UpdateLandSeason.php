<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Models\LandSeason;

class UpdateLandSeason
{
    public function execute(LandSeason $season, array $data): LandSeason
    {
        if (blank($data['crop'] ?? null) && ! blank($data['crop_id'] ?? null)) {
            $crop = Crop::find($data['crop_id']);
            $data['crop'] = $crop?->name;
        }

        $season->update($data);

        return $season;
    }
}
