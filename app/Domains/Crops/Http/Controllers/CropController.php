<?php

namespace App\Domains\Crops\Http\Controllers;

use App\Domains\Crops\Actions\CreateCrop;
use App\Domains\Crops\Actions\DeleteCrop;
use App\Domains\Crops\Actions\UpdateCrop;
use App\Domains\Crops\Models\Crop;
use App\Domains\Crops\Requests\StoreCropRequest;
use App\Domains\Crops\Requests\UpdateCropRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CropController extends Controller
{
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
        $action->execute($request->validated());

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
        $action->execute($crop, $request->validated());

        return redirect()->route('crops.index');
    }

    public function destroy(Crop $crop, DeleteCrop $action): RedirectResponse
    {
        $action->execute($crop);

        return redirect()->route('crops.index');
    }
}
