<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;

class CreateCost
{
    public function execute(array $data): Cost
    {
        return Cost::create($data);
    }
}
