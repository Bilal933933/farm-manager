<?php

namespace App\Domains\Lands\Http\Controllers;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Actions\CreateLand;
use App\Domains\Lands\Actions\CreateLandContract;
use App\Domains\Lands\Actions\CreateLandSeason;
use App\Domains\Lands\Actions\DeleteLand;
use App\Domains\Lands\Actions\DeleteLandContract;
use App\Domains\Lands\Actions\DeleteLandSeason;
use App\Domains\Lands\Actions\UpdateLand;
use App\Domains\Lands\Actions\UpdateLandContract;
use App\Domains\Lands\Actions\UpdateLandSeason;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Lands\Requests\StoreLandContractRequest;
use App\Domains\Lands\Requests\StoreLandRequest;
use App\Domains\Lands\Requests\StoreLandSeasonRequest;
use App\Domains\Lands\Requests\UpdateLandRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LandController extends Controller
{
    public function index(): Response
    {
        $lands = Land::with(['seasons', 'contracts'])->get();

        return Inertia::render('Lands/Index', [
            'lands' => $lands,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Lands/Create');
    }

    public function store(StoreLandRequest $request, CreateLand $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('lands.index');
    }

    public function show(Land $land): Response
    {
        $land->load(['seasons.crop', 'seasons.harvests', 'contracts']);

        return Inertia::render('Lands/Show', [
            'land' => $land,
            'crops' => Crop::orderBy('name')->get(),
        ]);
    }

    public function edit(Land $land): Response
    {
        return Inertia::render('Lands/Edit', [
            'land' => $land,
        ]);
    }

    public function update(UpdateLandRequest $request, Land $land, UpdateLand $action): RedirectResponse
    {
        $action->execute($land, $request->validated());

        return redirect()->route('lands.index');
    }

    public function destroy(Land $land, DeleteLand $action): RedirectResponse
    {
        $action->execute($land);

        return redirect()->route('lands.index');
    }

    public function storeContract(StoreLandContractRequest $request, CreateLandContract $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->back();
    }

    public function updateContract(StoreLandContractRequest $request, LandContract $contract, UpdateLandContract $action): RedirectResponse
    {
        $action->execute($contract, $request->validated());

        return redirect()->back();
    }

    public function destroyContract(LandContract $contract, DeleteLandContract $action): RedirectResponse
    {
        $action->execute($contract);

        return redirect()->back();
    }

    public function storeSeason(StoreLandSeasonRequest $request, CreateLandSeason $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->back();
    }

    public function updateSeason(StoreLandSeasonRequest $request, LandSeason $season, UpdateLandSeason $action): RedirectResponse
    {
        $action->execute($season, $request->validated());

        return redirect()->back();
    }

    public function destroySeason(LandSeason $season, DeleteLandSeason $action): RedirectResponse
    {
        $action->execute($season);

        return redirect()->back();
    }
}
