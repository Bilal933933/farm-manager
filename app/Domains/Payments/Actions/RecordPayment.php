<?php

namespace App\Domains\Payments\Actions;

use App\Domains\Common\Enums\ReferenceType;
use App\Domains\Lands\Models\LandContract;
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

        if (! empty($data['contract_id'])) {
            $contract = LandContract::find($data['contract_id']);
            $direction = match ($contract?->type) {
                'مؤجر' => LedgerDirection::Credit->value,
                default => LedgerDirection::Debit->value,
            };

            $label = match ($contract?->type) {
                'مؤجر' => 'دفعة إيجار',
                'مستأجر' => 'دفعة تأجير',
                'مزارع' => 'دفعة مزارعة',
                default => $data['type'] === 'دفع' ? 'دفعة' : 'مقبوض',
            };
        } else {
            $direction = $data['type'] === 'دفع'
                ? LedgerDirection::Debit->value
                : LedgerDirection::Credit->value;

            $label = $data['type'] === 'دفع' ? 'دفعة' : 'مقبوض';
        }

        $this->recordLedgerEntry->execute([
            'date' => $data['date'],
            'direction' => $direction,
            'amount' => $data['amount'],
            'description' => $label,
            'party_id' => $data['party_id'],
            'reference_type' => ReferenceType::Payment->value,
            'reference_id' => $payment->id,
        ]);

        return $payment;
    }
}
