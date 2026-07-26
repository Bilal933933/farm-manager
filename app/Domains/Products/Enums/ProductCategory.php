<?php

namespace App\Domains\Products\Enums;

enum ProductCategory: string
{
    case Fertilizer = 'سماد';
    case Pesticide = 'مبيد';
    case Seeds = 'بذور';
    case Seedlings = 'شتلات';
    case Irrigation = 'ري';
    case Greenhouse = 'صوبة';
    case Tools = 'أدوات';
    case Fuel = 'وقود';
    case Other = 'أخرى';
}
