<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;

class UpdateCost
{
    public function execute(Cost $cost, array $data): Cost
    {
        $cost->update($data);

        return $cost;
    }
}
