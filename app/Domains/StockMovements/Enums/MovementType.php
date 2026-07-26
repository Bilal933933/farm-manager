<?php

namespace App\Domains\StockMovements\Enums;

enum MovementType: string
{
    case In = 'داخل';
    case Out = 'خارج';
}
