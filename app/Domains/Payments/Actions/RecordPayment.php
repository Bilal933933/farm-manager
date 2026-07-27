<?php

namespace App\Domains\Payments\Actions;

use App\Domains\Ledger\Actions\RecordLedgerEntry;
use App\Domains\Ledger\Enums\LedgerDirection;
use App\Domains\Payments\Models\Payment;

class RecordPayment
{
    public function __construct(
        private RecordLedgerEntry $recordLedgerEntry,
    ) {}

    public function execute(array $data): Payment
    {
        $payment = Payment::create($data);

        $direction = $data['type'] === 'دفع'
            ? LedgerDirection::Debit->value
            : LedgerDirection::Credit->value;

        $label = $data['type'] === 'دفع' ? 'دفعة' : 'مقبوض';

        $this->recordLedgerEntry->execute([
            'date' => $data['date'],
            'direction' => $direction,
            'amount' => $data['amount'],
            'description' => $label,
            'party_id' => $data['party_id'],
            'reference_type' => Payment::class,
            'reference_id' => $payment->id,
        ]);

        return $payment;
    }
}
