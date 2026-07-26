<?php

namespace App\Domains\Products\Enums;

enum ProductStatus: string
{
    case Active = 'نشط';
    case Inactive = 'متوقف';
}
