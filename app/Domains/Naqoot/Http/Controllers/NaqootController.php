<?php

namespace App\Domains\Naqoot\Http\Controllers;

use App\Domains\Naqoot\Actions\CreateNaqoot;
use App\Domains\Naqoot\Actions\DeleteNaqoot;
use App\Domains\Naqoot\Actions\UpdateNaqoot;
use App\Domains\Naqoot\Enums\NaqootDirection;
use App\Domains\Naqoot\Models\Naqoot;
use App\Domains\Naqoot\Requests\StoreNaqootRequest;
use App\Domains\Naqoot\Requests\UpdateNaqootRequest;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NaqootController extends Controller
{
    use ToastResponse;

    public function index(): Response
    {
        $naqoot = Naqoot::orderByDesc('date')->orderByDesc('id')->get();

        $totalForUs = (float) $naqoot->where('direction', NaqootDirection::ForUs)->sum('amount');
        $totalOnUs = (float) $naqoot->where('direction', NaqootDirection::OnUs)->sum('amount');
        $countForUs = $naqoot->where('direction', NaqootDirection::ForUs)->count();
        $countOnUs = $naqoot->where('direction', NaqootDirection::OnUs)->count();

        return Inertia::render('Naqoot/Index', [
            'naqoot' => $naqoot,
            'summary' => [
                'count' => $naqoot->count(),
                'countForUs' => $countForUs,
                'countOnUs' => $countOnUs,
                'totalForUs' => $totalForUs,
                'totalOnUs' => $totalOnUs,
                'net' => $totalForUs - $totalOnUs,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Naqoot/Create');
    }

    public function store(StoreNaqootRequest $request, CreateNaqoot $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم إضافة النقوط بنجاح',
            'حدث خطأ أثناء إضافة النقوط',
        );

        return redirect()->route('naqoot.index');
    }

    public function edit(Naqoot $naqoot): Response
    {
        return Inertia::render('Naqoot/Edit', [
            'naqoot' => $naqoot,
        ]);
    }

    public function update(UpdateNaqootRequest $request, Naqoot $naqoot, UpdateNaqoot $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($naqoot, $request->validated()),
            'تم تحديث النقوط بنجاح',
            'حدث خطأ أثناء تحديث النقوط',
        );

        return redirect()->route('naqoot.index');
    }

    public function destroy(Naqoot $naqoot, DeleteNaqoot $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($naqoot),
            'تم حذف النقوط بنجاح',
            'حدث خطأ أثناء حذف النقوط',
        );

        return redirect()->route('naqoot.index');
    }
}
