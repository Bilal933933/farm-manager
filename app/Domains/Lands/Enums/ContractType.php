<?php

namespace App\Domains\Lands\Enums;

enum ContractType: string
{
    case Lessor = 'مؤجر';
    case Tenant = 'مستأجر';
    case Farmer = 'مزارع';
}
