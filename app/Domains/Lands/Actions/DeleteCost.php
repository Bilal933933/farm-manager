<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;

class DeleteCost
{
    public function execute(Cost $cost): void
    {
        $cost->delete();
    }
}
