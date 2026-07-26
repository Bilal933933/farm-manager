<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Land;

class CreateLand
{
    public function execute(array $data): Land
    {
        return Land::create($data);
    }
}
