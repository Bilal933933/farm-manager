<?php

namespace App\Domains\Lands\Enums;

enum SeasonStatus: string
{
    case Upcoming = 'قادم';
    case Active = 'نشط';
    case Harvesting = 'قيد الحصاد';
    case Completed = 'منتهي';
    case Cancelled = 'ملغي';
}
