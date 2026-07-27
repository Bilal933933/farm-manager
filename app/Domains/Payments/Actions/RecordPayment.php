<?php

namespace App\Domains\Payments\Actions;

use App\Domains\Payments\Models\Payment;

class RecordPayment
{
    public function execute(array $data): Payment
    {
        return Payment::create($data);
    }
}
