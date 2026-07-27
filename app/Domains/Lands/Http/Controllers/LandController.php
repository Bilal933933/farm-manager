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
use App\Domains\Sales\Models\Sale;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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

        $activeSeason = $land->seasons->firstWhere('status', 'نشط');

        $stats = [];
        foreach ($land->seasons as $season) {
            $totalHarvest = $season->harvests->sum('quantity');
            $harvestIds = $season->harvests->pluck('id');
            $totalSales = Sale::whereIn('harvest_id', $harvestIds)->sum(DB::raw('quantity * unit_price'));
            $totalSoldQty = Sale::whereIn('harvest_id', $harvestIds)->sum('quantity');

            $stats[$season->id] = [
                'total_harvest' => (float) $totalHarvest,
                'total_sales' => (float) $totalSales,
                'total_sold_qty' => (float) $totalSoldQty,
                'total_cost' => (float) ($season->actual_cost ?? $season->expected_cost ?? 0),
            ];

            $stats[$season->id]['profit'] = $stats[$season->id]['total_sales'] - $stats[$season->id]['total_cost'];
        }

        $allHarvestIds = $land->seasons->flatMap->harvests->pluck('id');
        $overallSales = Sale::whereIn('harvest_id', $allHarvestIds)->sum(DB::raw('quantity * unit_price'));
        $overallCosts = $land->seasons->sum(fn ($s) => (float) ($s->actual_cost ?? $s->expected_cost ?? 0));

        $sales = Sale::whereIn('harvest_id', $allHarvestIds)
            ->with(['party', 'harvest.landSeason.crop'])
            ->orderBy('date', 'desc')
            ->get()
            ->map(fn ($s) => array_merge($s->toArray(), [
                'unit' => $s->harvest?->landSeason?->crop?->unit?->value,
            ]));

        $costsBySeason = $land->seasons->map(fn ($s) => [
            'season_id' => $s->id,
            'crop_name' => $s->relationLoaded('crop') && $s->getRelation('crop') ? $s->getRelation('crop')->name : $s->getAttribute('crop'),
            'expected_cost' => (float) ($s->expected_cost ?? 0),
            'actual_cost' => (float) ($s->actual_cost ?? 0),
            'status' => $s->status,
        ]);

        return Inertia::render('Lands/Show', [
            'land' => $land,
            'crops' => Crop::orderBy('name')->get(),
            'activeSeason' => $activeSeason,
            'seasonStats' => $stats,
            'overallSales' => (float) $overallSales,
            'overallCosts' => (float) $overallCosts,
            'sales' => $sales,
            'costsBySeason' => $costsBySeason,
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
