<?php

namespace App\Domains\Lands\Enums;

enum CostType: string
{
    case Seeds = 'بذور';
    case Fertilizers = 'أسمدة';
    case Labor = 'عمالة';
    case Irrigation = 'ري';
    case Pesticides = 'مبيدات';
    case Harvest = 'حصاد';
    case Transport = 'نقل';
    case Rent = 'إيجار';
    case Utilities = 'خدمات';
    case Maintenance = 'صيانة';
    case Other = 'أخرى';
}
