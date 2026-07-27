<?php

namespace App\Domains\Harvests\Actions;

use App\Domains\Harvests\Models\Harvest;

class RecordHarvest
{
    public function execute(array $data): Harvest
    {
        return Harvest::create($data);
    }
}
