<?php

namespace App\Domains\StockMovements\Enums;

enum MovementReason: string
{
    case Purchase = 'شراء';
    case SeasonConsumption = 'صرف';
    case InventoryCount = 'جرد';
    case Damage = 'إتلاف';
    case Return = 'مرتجع';
    case Correction = 'تصحيح';
}
