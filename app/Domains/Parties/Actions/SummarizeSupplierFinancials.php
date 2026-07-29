<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;

class SummarizeSupplierFinancials
{
    public function execute(Party $party): ?array
    {
        $purchases = $party->purchases()->with('items.product')->get();

        if ($purchases->isEmpty()) {
            return null;
        }

        $totalAmount = (float) $purchases->sum(fn ($p) => $p->items->sum(fn ($item) => $item->quantity * $item->unit_price));

        $totalPaid = (float) Payment::where('party_id', $party->id)
            ->whereIn('type', [PaymentType::Payment, PaymentType::Advance])
            ->sum('amount');

        return [
            'total_purchases_amount' => round($totalAmount, 2),
            'total_paid' => round($totalPaid, 2),
            'total_remaining' => round($totalAmount - $totalPaid, 2),
        ];
    }
}
