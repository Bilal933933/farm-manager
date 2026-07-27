<?php

namespace App\Domains\Crops\Http\Controllers;

use App\Domains\Crops\Actions\CreateCrop;
use App\Domains\Crops\Actions\DeleteCrop;
use App\Domains\Crops\Actions\UpdateCrop;
use App\Domains\Crops\Models\Crop;
use App\Domains\Crops\Requests\StoreCropRequest;
use App\Domains\Crops\Requests\UpdateCropRequest;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CropController extends Controller
{
    use ToastResponse;

    public function index(): Response
    {
        $crops = Crop::orderBy('name')->get();

        return Inertia::render('Crops/Index', [
            'crops' => $crops,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Crops/Create');
    }

    public function store(StoreCropRequest $request, CreateCrop $action): RedirectResponse
    {
        try {
            $action->execute($request->validated());

            $this->success('تم إضافة المحصول بنجاح');
        } catch (\Throwable $e) {
            $this->error('حدث خطأ أثناء إضافة المحصول');
            report($e);
        }

        return redirect()->route('crops.index');
    }

    public function show(Crop $crop): Response
    {
        return Inertia::render('Crops/Show', [
            'crop' => $crop,
        ]);
    }

    public function edit(Crop $crop): Response
    {
        return Inertia::render('Crops/Edit', [
            'crop' => $crop,
        ]);
    }

    public function update(UpdateCropRequest $request, Crop $crop, UpdateCrop $action): RedirectResponse
    {
        try {
            $action->execute($crop, $request->validated());

            $this->success('تم تحديث المحصول بنجاح');
        } catch (\Throwable $e) {
            $this->error('حدث خطأ أثناء تحديث المحصول');
            report($e);
        }

        return redirect()->route('crops.index');
    }

    public function destroy(Crop $crop, DeleteCrop $action): RedirectResponse
    {
        try {
            $action->execute($crop);

            $this->success('تم حذف المحصول بنجاح');
        } catch (\Throwable $e) {
            $this->error('حدث خطأ أثناء حذف المحصول');
            report($e);
        }

        return redirect()->route('crops.index');
    }
}
