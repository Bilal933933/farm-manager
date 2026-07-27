<?php

namespace App\Domains\Ledger\Enums;

enum LedgerDirection: string
{
    case Debit = 'مدين';
    case Credit = 'دائن';
}
