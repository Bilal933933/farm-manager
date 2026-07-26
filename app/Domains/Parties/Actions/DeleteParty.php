<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Parties\Models\Party;
use Illuminate\Validation\ValidationException;

class DeleteParty
{
    public function execute(Party $party): void
    {
        if ($party->contracts()->exists()) {
            throw ValidationException::withMessages([
                'party' => 'لا يمكن حذف هذا الطرف لوجود عقود مرتبطة به.',
            ]);
        }

        $party->delete();
    }
}
