<?php

namespace App\Domains\Lands\Enums;

enum ContractType: string
{
    case Rent = 'إيجار';
    case Ownership = 'تملك';
}
