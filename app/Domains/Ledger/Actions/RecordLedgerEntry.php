<?php

namespace App\Domains\Ledger\Actions;

use App\Domains\Ledger\Models\LedgerEntry;

class RecordLedgerEntry
{
    public function execute(array $data): LedgerEntry
    {
        return LedgerEntry::create($data);
    }
}
