<?php

namespace App\Domains\Crops\Actions;

use App\Domains\Crops\Models\Crop;

class UpdateCrop
{
    public function execute(Crop $crop, array $data): Crop
    {
        $crop->update($data);

        return $crop;
    }
}
