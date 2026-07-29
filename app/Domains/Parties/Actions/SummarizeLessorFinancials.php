<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Lands\Models\LandContract;
use App\Domains\Parties\Models\Party;

class SummarizeLessorFinancials
{
    public function execute(Party $party): ?array
    {
        $contracts = LandContract::where('party_id', $party->id)
            ->where('type', 'مؤجر')
            ->with('land')
            ->get();

        if ($contracts->isEmpty()) {
            return null;
        }

        $contractsData = [];
        $totalRentAmount = 0;
        $totalPaid = 0;

        foreach ($contracts as $contract) {
            $contractAmount = (float) $contract->amount;
            $paid = $contract->paid_amount;
            $remaining = $contract->remaining;

            $contractsData[] = [
                'contract_id' => $contract->id,
                'land_name' => $contract->land->name,
                'contract_amount' => $contractAmount,
                'paid' => $paid,
                'remaining' => $remaining,
            ];

            $totalRentAmount += $contractAmount;
            $totalPaid += $paid;
        }

        return [
            'total_rent_amount' => round($totalRentAmount, 2),
            'total_paid' => round($totalPaid, 2),
            'total_remaining' => round($totalRentAmount - $totalPaid, 2),
            'contracts' => $contractsData,
        ];
    }
}
