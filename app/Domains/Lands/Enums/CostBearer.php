<?php

namespace App\Domains\Lands\Enums;

enum CostBearer: string
{
    case LandOwner = 'مالك';
    case Farmer = 'مزارع';
    case Shared = 'مشترك';
}
