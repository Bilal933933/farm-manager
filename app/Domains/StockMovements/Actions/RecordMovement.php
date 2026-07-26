<?php

namespace App\Domains\StockMovements\Actions;

use App\Domains\StockMovements\Models\StockMovement;

class RecordMovement
{
    public function execute(array $data): StockMovement
    {
        return StockMovement::create($data);
    }
}
