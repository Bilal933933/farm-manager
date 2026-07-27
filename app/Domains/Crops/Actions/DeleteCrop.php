<?php

namespace App\Domains\Crops\Actions;

use App\Domains\Crops\Models\Crop;

class DeleteCrop
{
    public function execute(Crop $crop): void
    {
        $crop->delete();
    }
}
