<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;

class SummarizeAmanatFinancials
{
    public function execute(Party $party): ?array
    {
        $hasPayments = Payment::where('party_id', $party->id)->exists();

        if (! $hasPayments) {
            return null;
        }

        $totalDeposited = (float) Payment::where('party_id', $party->id)
            ->where('type', PaymentType::Receipt)
            ->sum('amount');

        $totalReturned = (float) Payment::where('party_id', $party->id)
            ->where('type', PaymentType::Payment)
            ->sum('amount');

        return [
            'total_deposited' => round($totalDeposited, 2),
            'total_returned' => round($totalReturned, 2),
            'total_remaining' => round($totalDeposited - $totalReturned, 2),
        ];
    }
}
