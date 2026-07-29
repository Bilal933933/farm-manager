<?php

namespace App\Domains\Common\Enums;

enum ReferenceType: string
{
    case LandSeason = 'land_season';
    case Purchase = 'purchase';
    case Sale = 'sale';
    case Payment = 'payment';
}
