<?php

namespace App\Domains\Lands\Http\Controllers;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Actions\CreateCost;
use App\Domains\Lands\Actions\DeleteCost;
use App\Domains\Lands\Actions\ListCosts;
use App\Domains\Lands\Actions\UpdateCost;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Lands\Requests\ListCostRequest;
use App\Domains\Lands\Requests\StoreCostRequest;
use App\Domains\Lands\Requests\UpdateCostRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CostController extends Controller
{
    public function index(ListCostRequest $request, ListCosts $action): Response
    {
        $filters = $request->validated();
        $costs = $action->execute($filters);

        $summary = Cost::query()
            ->when($filters['land_id'] ?? null, fn ($q, $v) => $q->where('land_id', $v))
            ->when($filters['land_season_id'] ?? null, fn ($q, $v) => $q->where('land_season_id', $v))
            ->when($filters['crop_id'] ?? null, fn ($q, $v) => $q->where('crop_id', $v))
            ->when($filters['type'] ?? null, fn ($q, $v) => $q->where('type', $v))
            ->when($filters['date_from'] ?? null, fn ($q, $v) => $q->whereDate('date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn ($q, $v) => $q->whereDate('date', '<=', $v))
            ->when($filters['search'] ?? null, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('description', 'like', "%{$v}%")
                    ->orWhere('notes', 'like', "%{$v}%");
            }))
            ->selectRaw('COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount')
            ->first();

        return Inertia::render('Costs/Index', [
            'costs' => $costs,
            'summary' => $summary,
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'crops' => Crop::orderBy('name')->get(['id', 'name']),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Costs/Create', [
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'seasons' => LandSeason::orderBy('planting_date', 'desc')->with('land:id,name')->get(['id', 'land_id', 'crop', 'planting_date']),
            'crops' => Crop::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreCostRequest $request, CreateCost $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('costs.index');
    }

    public function show(Cost $cost): Response
    {
        $cost->load(['land', 'landSeason', 'crop']);

        return Inertia::render('Costs/Show', [
            'cost' => $cost,
        ]);
    }

    public function edit(Cost $cost): Response
    {
        $cost->load(['land', 'landSeason', 'crop']);

        return Inertia::render('Costs/Edit', [
            'cost' => $cost,
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'seasons' => LandSeason::orderBy('planting_date', 'desc')->with('land:id,name')->get(['id', 'land_id', 'crop', 'planting_date']),
            'crops' => Crop::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateCostRequest $request, Cost $cost, UpdateCost $action): RedirectResponse
    {
        $action->execute($cost, $request->validated());

        return redirect()->route('costs.index');
    }

    public function destroy(Cost $cost, DeleteCost $action): RedirectResponse
    {
        $action->execute($cost);

        return redirect()->route('costs.index');
    }
}
