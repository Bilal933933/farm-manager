<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Parties\Models\Party;

class CreateParty
{
    public function execute(array $data): Party
    {
        return Party::create($data);
    }
}
