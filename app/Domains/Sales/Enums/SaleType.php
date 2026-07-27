<?php

namespace App\Domains\Sales\Enums;

enum SaleType: string
{
    case Cash = 'نقدي';
    case Credit = 'آجل';
}
