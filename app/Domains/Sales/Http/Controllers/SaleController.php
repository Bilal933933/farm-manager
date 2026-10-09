<?php

namespace App\Domains\Sales\Http\Controllers;

use App\Domains\Lands\Models\Harvest;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Models\Party;
use App\Domains\Sales\Actions\CreateSale;
use App\Domains\Sales\Models\Sale;
use App\Domains\Sales\Requests\ListSaleRequest;
use App\Domains\Sales\Requests\StoreSaleRequest;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    use ToastResponse;

    public function index(ListSaleRequest $request): Response
    {
        $filters = $request->validated();

        $sales = Sale::with(['party', 'harvest.landSeason.land', 'harvest.landSeason.crop', 'attachments'])
            ->when($filters['land_season_id'] ?? null, fn ($q, $v) => $q->whereHas('harvest', fn ($q) => $q->where('land_season_id', $v)))
            ->when($filters['land_id'] ?? null, fn ($q, $v) => $q->whereHas('harvest.landSeason', fn ($q) => $q->where('land_id', $v)))
            ->orderBy('date', 'desc')
            ->get();

        $seasons = LandSeason::with('land:id,name', 'crop:id,name')
            ->orderBy('planting_date', 'desc')
            ->get(['id', 'land_id', 'crop_id', 'planting_date'])
            ->map(fn ($s) => [
                'id' => $s->id,
                'land_id' => $s->land_id,
                'label' => $s->land->name.' - '.($s->crop?->name ?? $s->planting_date->format('Y-m-d')),
            ]);

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'seasons' => $seasons,
            'filters' => $filters,
        ]);
    }

    public function create(): Response
    {
        $harvests = Harvest::with('landSeason.land', 'landSeason.crop')
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Sales/Create', [
            'harvests' => $harvests,
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'parties' => Party::orderBy('name')->get(),
        ]);
    }

    public function store(StoreSaleRequest $request, CreateSale $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم تسجيل البيع بنجاح',
            'حدث خطأ أثناء تسجيل البيع',
        );

        return redirect()->back();
    }

    public function show(Sale $sale): Response
    {
        $sale->load(['party', 'harvest.landSeason.land', 'harvest.landSeason.crop', 'attachments']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }
}
