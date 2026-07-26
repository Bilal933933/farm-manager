<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\LandContract;

class DeleteLandContract
{
    public function execute(LandContract $contract): void
    {
        $contract->delete();
    }
}
