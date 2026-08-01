<?php

namespace App\Domains\Lands\Http\Controllers;

use App\Domains\Lands\Actions\RecordHarvest;
use App\Domains\Lands\Requests\StoreHarvestRequest;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;

class HarvestController extends Controller
{
    use ToastResponse;

    public function store(StoreHarvestRequest $request, RecordHarvest $action): RedirectResponse
    {
        $succeeded = $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم تسجيل الحصاد بنجاح',
            'حدث خطأ أثناء تسجيل الحصاد',
        );

        if (! $succeeded) {
            return redirect()->back()->withErrors(['form' => 'حدث خطأ أثناء تسجيل الحصاد. تأكد من أن الموسم في حالة "نشط" أو "قيد الحصاد".']);
        }

        return redirect()->back();
    }
}
