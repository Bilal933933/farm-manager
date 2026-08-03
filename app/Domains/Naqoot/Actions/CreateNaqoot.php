<?php

namespace App\Domains\Naqoot\Actions;

use App\Domains\Naqoot\Models\Naqoot;

class CreateNaqoot
{
    public function execute(array $data): Naqoot
    {
        return Naqoot::create($data);
    }
}
