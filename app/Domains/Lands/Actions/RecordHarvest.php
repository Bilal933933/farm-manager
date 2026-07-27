<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Harvest;

class RecordHarvest
{
    public function execute(array $data): Harvest
    {
        return Harvest::create($data);
    }
}
