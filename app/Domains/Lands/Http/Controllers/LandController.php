<?php

namespace App\Domains\Lands\Http\Controllers;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Actions\CalculateSeasonFinancials;
use App\Domains\Lands\Actions\CreateLand;
use App\Domains\Lands\Actions\CreateLandContract;
use App\Domains\Lands\Actions\CreateLandSeason;
use App\Domains\Lands\Actions\DeleteLand;
use App\Domains\Lands\Actions\DeleteLandContract;
use App\Domains\Lands\Actions\DeleteLandSeason;
use App\Domains\Lands\Actions\UpdateLand;
use App\Domains\Lands\Actions\UpdateLandContract;
use App\Domains\Lands\Actions\UpdateLandSeason;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Harvest;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Lands\Requests\StoreLandContractRequest;
use App\Domains\Lands\Requests\StoreLandRequest;
use App\Domains\Lands\Requests\StoreLandSeasonRequest;
use App\Domains\Lands\Requests\UpdateLandRequest;
use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
use App\Domains\Products\Enums\ProductStatus;
use App\Domains\Products\Models\Product;
use App\Domains\Purchases\Models\PurchaseItem;
use App\Domains\Sales\Models\Sale;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LandController extends Controller
{
    use ToastResponse;

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
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم إنشاء الأرض بنجاح',
            'حدث خطأ أثناء إنشاء الأرض',
        );

        return redirect()->route('lands.index');
    }

    public function show(Land $land, CalculateSeasonFinancials $calculateSeasonFinancials): Response
    {
        $land->load(['contracts.party', 'seasons.crop', 'seasons.farmer']);

        $activeSeason = $land->seasons->firstWhere('status', 'نشط');

        $allSeasonIds = $land->seasons->pluck('id');
        $totalHarvest = (float) Harvest::whereIn('land_season_id', $allSeasonIds)->sum('quantity');
        $overallCosts = (float) Cost::where('land_id', $land->id)->sum('amount');

        $allHarvestIds = Harvest::whereIn('land_season_id', $allSeasonIds)->pluck('id');
        $overallSales = (float) Sale::whereIn('harvest_id', $allHarvestIds)->sum(DB::raw('quantity * unit_price'));

        $costsCount = Cost::where('land_id', $land->id)->count();
        $revenuesCount = Sale::whereIn('harvest_id', $allHarvestIds)->count();

        return Inertia::render('Lands/Show', [
            'land' => $land,
            'activeSeason' => $activeSeason,
            'overallSales' => $overallSales,
            'overallCosts' => $overallCosts,
            'totalHarvest' => $totalHarvest,
            'costsCount' => $costsCount,
            'revenuesCount' => $revenuesCount,
            'parties' => Party::orderBy('name')->get(['id', 'name', 'type', 'phone']),

            'farmers' => Inertia::defer(fn () => Party::where('category', PartyCategory::Farmer->value)->orderBy('name')->get(['id', 'name', 'phone']), 'seasons'),

            'crops' => Inertia::defer(fn () => Crop::orderBy('name')->get(), 'seasons'),

            'seasonStats' => Inertia::defer(function () use ($land, $calculateSeasonFinancials): array {
                return $calculateSeasonFinancials->forLand($land);
            }, 'seasons'),

            'costs' => Inertia::defer(function () use ($land) {
                $land->load(['seasons.costs']);

                $seasonCosts = $land->seasons->flatMap(fn ($s) => $s->costs->map(fn ($c) => [
                    'id' => $c->id,
                    'season_id' => $s->id,
                    'crop_name' => $s->relationLoaded('crop') && $s->getRelation('crop') ? $s->getRelation('crop')->name : $s->getAttribute('crop'),
                    'type' => $c->type,
                    'description' => $c->description,
                    'amount' => (float) $c->amount,
                    'date' => $c->date->toDateString(),
                    'notes' => $c->notes,
                    'land_id' => $c->land_id,
                    'land_season_id' => $c->land_season_id,
                ]));

                $directCosts = Cost::where('land_id', $land->id)->whereNull('land_season_id')->with('crop')->get()->map(fn ($c) => [
                    'id' => $c->id,
                    'season_id' => null,
                    'crop_name' => $c->crop?->name ?? '—',
                    'type' => $c->type,
                    'description' => $c->description,
                    'amount' => (float) $c->amount,
                    'date' => $c->date->toDateString(),
                    'notes' => $c->notes,
                    'land_id' => $c->land_id,
                    'land_season_id' => null,
                ]);

                return $seasonCosts->concat($directCosts)->sortByDesc('date')->values();
            }, 'costs'),

            'products' => Inertia::defer(function () {
                return Product::query()
                    ->where('status', ProductStatus::Active->value)
                    ->orderBy('display_order')
                    ->orderBy('name')
                    ->get(['id', 'name', 'unit', 'category'])
                    ->map(function (Product $product) {
                        $lastPurchasePrice = PurchaseItem::where('product_id', $product->id)
                            ->latest('id')
                            ->value('unit_price');

                        return [
                            'id' => $product->id,
                            'name' => $product->name,
                            'unit' => $product->unit->value,
                            'category' => $product->category->value,
                            'last_purchase_price' => $lastPurchasePrice !== null ? (float) $lastPurchasePrice : null,
                        ];
                    });
            }, 'costs'),

            'sales' => Inertia::defer(function () use ($land) {
                $land->load(['seasons.harvests.sales']);

                $allHarvestIds = $land->seasons->flatMap->harvests->pluck('id');

                return Sale::whereIn('harvest_id', $allHarvestIds)
                    ->with(['party', 'harvest.landSeason.crop'])
                    ->orderBy('date', 'desc')
                    ->get()
                    ->map(function ($s) {
                        $crop = $s->harvest?->landSeason?->relationLoaded('crop') ? $s->harvest->landSeason->getRelation('crop') : null;

                        return array_merge($s->toArray(), [
                            'unit' => $crop?->unit?->value,
                        ]);
                    });
            }, 'revenues'),
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
        $this->executeWithToast(
            fn () => $action->execute($land, $request->validated()),
            'تم تحديث الأرض بنجاح',
            'حدث خطأ أثناء تحديث الأرض',
        );

        return redirect()->route('lands.index');
    }

    public function destroy(Land $land, DeleteLand $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($land),
            'تم حذف الأرض بنجاح',
            'حدث خطأ أثناء حذف الأرض',
        );

        return redirect()->route('lands.index');
    }

    public function storeContract(StoreLandContractRequest $request, CreateLandContract $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم إضافة العقد بنجاح',
            'حدث خطأ أثناء إضافة العقد',
        );

        return redirect()->back();
    }

    public function updateContract(StoreLandContractRequest $request, LandContract $contract, UpdateLandContract $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($contract, $request->validated()),
            'تم تحديث العقد بنجاح',
            'حدث خطأ أثناء تحديث العقد',
        );

        return redirect()->back();
    }

    public function destroyContract(LandContract $contract, DeleteLandContract $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($contract),
            'تم حذف العقد بنجاح',
            'حدث خطأ أثناء حذف العقد',
        );

        return redirect()->back();
    }

    public function storeSeason(StoreLandSeasonRequest $request, CreateLandSeason $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم إضافة الموسم بنجاح',
            'حدث خطأ أثناء إضافة الموسم',
        );

        return redirect()->back();
    }

    public function updateSeason(StoreLandSeasonRequest $request, LandSeason $season, UpdateLandSeason $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($season, $request->validated()),
            'تم تحديث الموسم بنجاح',
            'حدث خطأ أثناء تحديث الموسم',
        );

        return redirect()->back();
    }

    public function destroySeason(LandSeason $season, DeleteLandSeason $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($season),
            'تم حذف الموسم بنجاح',
            'حدث خطأ أثناء حذف الموسم',
        );

        return redirect()->back();
    }

    public function showSeason(Land $land, LandSeason $season, CalculateSeasonFinancials $calculateSeasonFinancials): Response
    {
        $season->load(['crop', 'farmer', 'harvests.sales', 'costs']);

        $harvests = $season->harvests->map(fn ($h) => [
            'id' => $h->id,
            'name' => $h->name,
            'date' => $h->date->toDateString(),
            'quantity' => (float) $h->quantity,
            'sold_quantity' => (float) $h->sales->sum('quantity'),
            'remaining' => (float) $h->quantity - (float) $h->sales->sum('quantity'),
            'notes' => $h->notes,
        ]);

        $costs = $season->costs->map(fn ($c) => [
            'id' => $c->id,
            'type' => $c->type,
            'description' => $c->description,
            'amount' => (float) $c->amount,
            'date' => $c->date->toDateString(),
            'notes' => $c->notes,
        ]);

        $sales = $season->harvests->flatMap->sales->map(fn ($s) => [
            'id' => $s->id,
            'date' => $s->date->toDateString(),
            'quantity' => (float) $s->quantity,
            'unit_price' => (float) $s->unit_price,
            'total' => (float) $s->quantity * (float) $s->unit_price,
            'party' => $s->party?->only(['id', 'name']),
            'payment_type' => $s->payment_type,
            'notes' => $s->notes,
        ])->sortByDesc('date')->values();

        return Inertia::render('Lands/SeasonShow', [
            'land' => $land->only(['id', 'name']),
            'season' => $season,
            'farmers' => Party::where('category', PartyCategory::Farmer->value)->orderBy('name')->get(['id', 'name']),
            'crop_name' => $season->relationLoaded('crop') && $season->getRelation('crop') ? $season->getRelation('crop')->name : $season->getAttribute('crop'),
            'harvests' => $harvests,
            'costs' => $costs,
            'sales' => $sales,
            'stats' => $calculateSeasonFinancials->forSeason($season),
        ]);
    }
}
