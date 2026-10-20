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
use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CostController extends Controller
{
    use ToastResponse;

    public function index(ListCostRequest $request, ListCosts $action): Response
    {
        $filters = $request->validated();
        $costs = $action->execute($filters);

        $summary = Cost::query()
            ->when($filters['land_id'] ?? null, fn ($q, $v) => $q->where('land_id', $v))
            ->when($filters['land_season_id'] ?? null, fn ($q, $v) => $q->where('land_season_id', $v))
            ->when($filters['crop_id'] ?? null, fn ($q, $v) => $q->where('crop_id', $v))
            ->when($filters['party_id'] ?? null, fn ($q, $v) => $q->where('party_id', $v))
            ->when($filters['type'] ?? null, fn ($q, $v) => $q->where('type', $v))
            ->when($filters['date_from'] ?? null, fn ($q, $v) => $q->whereDate('date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn ($q, $v) => $q->whereDate('date', '<=', $v))
            ->when($filters['search'] ?? null, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('description', 'like', "%{$v}%")
                    ->orWhere('notes', 'like', "%{$v}%");
            }))
            ->selectRaw('COUNT(*) as count, COALESCE(SUM(amount), 0) as total_amount')
            ->first();

        $seasons = LandSeason::with('land:id,name', 'crop:id,name')
            ->orderBy('planting_date', 'desc')
            ->get(['id', 'land_id', 'crop_id', 'planting_date'])
            ->map(fn ($s) => [
                'id' => $s->id,
                'land_id' => $s->land_id,
                'label' => $s->land->name.' - '.($s->crop?->name ?? $s->planting_date->format('Y-m-d')),
            ]);

        return Inertia::render('Costs/Index', [
            'costs' => $costs,
            'summary' => $summary,
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'seasons' => $seasons,
            'crops' => Crop::orderBy('name')->get(['id', 'name']),
            'providers' => $this->providers(),
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Costs/Create', [
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'seasons' => LandSeason::orderBy('planting_date', 'desc')->with('land:id,name', 'crop:id,name')->get(['id', 'land_id', 'crop_id', 'planting_date']),
            'crops' => Crop::orderBy('name')->get(['id', 'name']),
            'providers' => $this->providers(),
        ]);
    }

    public function store(StoreCostRequest $request, CreateCost $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم إضافة التكلفة بنجاح',
            'حدث خطأ أثناء إضافة التكلفة',
        );

        return redirect()->back();
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
            'seasons' => LandSeason::orderBy('planting_date', 'desc')->with('land:id,name', 'crop:id,name')->get(['id', 'land_id', 'crop_id', 'planting_date']),
            'crops' => Crop::orderBy('name')->get(['id', 'name']),
            'providers' => $this->providers(),
        ]);
    }

    public function update(UpdateCostRequest $request, Cost $cost, UpdateCost $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($cost, $request->validated()),
            'تم تحديث التكلفة بنجاح',
            'حدث خطأ أثناء تحديث التكلفة',
        );

        return redirect()->route('costs.index');
    }

    public function destroy(Cost $cost, DeleteCost $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($cost),
            'تم حذف التكلفة بنجاح',
            'حدث خطأ أثناء حذف التكلفة',
        );

        return redirect()->route('costs.index');
    }

    private function providers(): Collection
    {
        return Party::where('category', PartyCategory::ServiceProvider->value)
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
