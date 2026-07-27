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
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم تسجيل الحصاد بنجاح',
            'حدث خطأ أثناء تسجيل الحصاد',
        );

        return redirect()->back();
    }
}
