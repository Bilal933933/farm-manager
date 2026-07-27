<?php

namespace App\Domains\Crops\Actions;

use App\Domains\Crops\Models\Crop;

class CreateCrop
{
    public function execute(array $data): Crop
    {
        return Crop::create($data);
    }
}
