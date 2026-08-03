<?php

namespace App\Domains\Naqoot\Actions;

use App\Domains\Naqoot\Models\Naqoot;

class DeleteNaqoot
{
    public function execute(Naqoot $naqoot): void
    {
        $naqoot->delete();
    }
}
