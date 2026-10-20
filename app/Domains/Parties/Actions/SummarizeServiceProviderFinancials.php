<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Lands\Models\Cost;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;

class SummarizeServiceProviderFinancials
{
    public function execute(Party $party): ?array
    {
        if (! Cost::where('party_id', $party->id)->exists()) {
            return null;
        }

        $totalServicesAmount = (float) Cost::where('party_id', $party->id)->sum('amount');

        $totalPaid = (float) Payment::where('party_id', $party->id)
            ->whereIn('type', [PaymentType::Payment, PaymentType::Advance])
            ->sum('amount');

        return [
            'total_services_amount' => round($totalServicesAmount, 2),
            'total_paid' => round($totalPaid, 2),
            'total_remaining' => round($totalServicesAmount - $totalPaid, 2),
        ];
    }
}
