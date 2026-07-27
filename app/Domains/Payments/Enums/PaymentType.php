<?php

namespace App\Domains\Payments\Enums;

enum PaymentType: string
{
    case Payment = 'دفع';
    case Receipt = 'قبض';
}
