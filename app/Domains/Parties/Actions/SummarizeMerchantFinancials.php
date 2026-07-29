<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;

class SummarizeMerchantFinancials
{
    public function execute(Party $party): ?array
    {
        $sales = $party->sales()->get();

        if ($sales->isEmpty()) {
            return null;
        }

        $totalAmount = (float) $sales->sum(fn ($s) => $s->total);

        $totalReceived = (float) Payment::where('party_id', $party->id)
            ->where('type', PaymentType::Receipt)
            ->sum('amount');

        return [
            'total_sales_amount' => round($totalAmount, 2),
            'total_received' => round($totalReceived, 2),
            'total_due' => round($totalAmount - $totalReceived, 2),
        ];
    }
}
