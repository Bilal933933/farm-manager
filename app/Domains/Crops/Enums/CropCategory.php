<?php

namespace App\Domains\Crops\Enums;

enum CropCategory: string
{
    case FieldCrops = 'محاصيل حقلية';
    case Vegetables = 'خضروات';
    case Fruits = 'فاكهة';
    case Forage = 'أعلاف';
    case Other = 'أخرى';
}
