<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Parties\Models\Party;

class UpdateParty
{
    public function execute(Party $party, array $data): Party
    {
        $party->update($data);

        return $party;
    }
}
