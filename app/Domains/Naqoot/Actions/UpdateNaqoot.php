<?php

namespace App\Domains\Naqoot\Actions;

use App\Domains\Naqoot\Models\Naqoot;

class UpdateNaqoot
{
    public function execute(Naqoot $naqoot, array $data): Naqoot
    {
        $naqoot->update($data);

        return $naqoot;
    }
}
