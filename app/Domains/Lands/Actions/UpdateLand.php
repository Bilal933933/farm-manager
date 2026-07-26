<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Land;

class UpdateLand
{
    public function execute(Land $land, array $data): Land
    {
        $land->update($data);

        return $land;
    }
}
