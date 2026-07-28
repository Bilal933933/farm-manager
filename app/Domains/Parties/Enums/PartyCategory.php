<?php

namespace App\Domains\Parties\Enums;

enum PartyCategory: string
{
    case Lessor = 'مؤجر';
    case Lessee = 'مستأجر';
    case Farmer = 'مزارع';
    case Supplier = 'متجر مستلزمات زراعية';
    case Merchant = 'تاجر';
}
