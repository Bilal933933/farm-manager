<?php

namespace App\Domains\Purchases\Enums;

enum PaymentType: string
{
    case Cash = 'نقدي';
    case Credit = 'آجل';
}
