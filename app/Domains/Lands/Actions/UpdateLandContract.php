<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\LandContract;

class UpdateLandContract
{
    public function execute(LandContract $contract, array $data): LandContract
    {
        $data['amount'] = $data['amount'] ?? $contract->amount;

        $contract->update($data);

        return $contract;
    }
}
