<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Land;

class DeleteLand
{
    public function execute(Land $land): void
    {
        $land->delete();
    }
}
