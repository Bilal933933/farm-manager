<?php

namespace App\Domains\Products\Enums;

enum ProductUnit: string
{
    case Kilogram = 'كجم';
    case Ton = 'طن';
    case Liter = 'لتر';
    case Bag = 'شيكارة';
    case Piece = 'قطعة';
    case Roll = 'لفة';
    case Meter = 'متر';
    case Box = 'علبة';
}
