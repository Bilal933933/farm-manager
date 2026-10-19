<?php

namespace App\Http\Controllers;

use App\Domains\Lands\Enums\LandStatus;
use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Sales\Models\Sale;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $salesTotal = (float) Sale::sum(DB::raw('quantity * unit_price'));
        $costsTotal = (float) Cost::sum('amount');

        return Inertia::render('dashboard', [
            'stats' => [
                'activeLands' => Land::where('status', LandStatus::Active->value)->count(),
                'totalLands' => Land::count(),
                'activeSeasons' => LandSeason::whereIn('status', [
                    SeasonStatus::Active->value,
                    SeasonStatus::Harvesting->value,
                ])->count(),
                'salesTotal' => round($salesTotal, 2),
                'costsTotal' => round($costsTotal, 2),
                'profit' => round($salesTotal - $costsTotal, 2),
            ],
            'activeSeasons' => $this->activeSeasons(),
            'latestSales' => $this->latestSales(),
            'partyBalances' => $this->partyBalances(),
        ]);
    }

    /**
     * @return Collection<int, array{id: int, land_id: int, land_name: string, crop_name: string, planting_date: string|null, costs_total: float, status: string}>
     */
    private function activeSeasons(): Collection
    {
        return LandSeason::query()
            ->with(['land:id,name', 'crop:id,name'])
            ->withSum('costs as costs_total', 'amount')
            ->whereIn('status', [SeasonStatus::Active->value, SeasonStatus::Harvesting->value])
            ->orderByDesc('planting_date')
            ->limit(5)
            ->get()
            ->map(fn (LandSeason $season): array => [
                'id' => $season->id,
                'land_id' => $season->land_id,
                'land_name' => $season->land?->name ?? '—',
                'crop_name' => $season->crop?->name ?? '—',
                'planting_date' => $season->planting_date?->toDateString(),
                'costs_total' => round((float) ($season->costs_total ?? 0), 2),
                'status' => $season->status->value,
            ]);
    }

    /**
     * @return Collection<int, array{id: int, date: string|null, crop_name: string, party_name: string, quantity: float, total: float}>
     */
    private function latestSales(): Collection
    {
        return Sale::query()
            ->with(['party:id,name', 'harvest.landSeason.crop:id,name'])
            ->orderByDesc('date')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Sale $sale): array => [
                'id' => $sale->id,
                'date' => $sale->date?->toDateString(),
                'crop_name' => $sale->harvest?->landSeason?->crop?->name ?? '—',
                'party_name' => $sale->party?->name ?? '—',
                'quantity' => round((float) $sale->quantity, 2),
                'total' => round((float) $sale->total, 2),
            ]);
    }

    /**
     * @return Collection<int, array{id: int, name: string, category: string, kind: 'receivable'|'payable', amount: float}>
     */
    private function partyBalances(): Collection
    {
        $receivables = DB::table('parties')
            ->where('parties.category', PartyCategory::Merchant->value)
            ->whereNull('parties.deleted_at')
            ->select('parties.id', 'parties.name', 'parties.category')
            ->selectRaw(
                '(select coalesce(sum(s.quantity * s.unit_price), 0) from sales s where s.party_id = parties.id and s.deleted_at is null)'
                .' - (select coalesce(sum(p.amount), 0) from payments p where p.party_id = parties.id and p.deleted_at is null and p.type = ?) as amount',
                [PaymentType::Receipt->value],
            )
            ->get()
            ->map(fn (object $row): array => [
                'id' => (int) $row->id,
                'name' => (string) $row->name,
                'category' => (string) $row->category,
                'kind' => 'receivable',
                'amount' => round((float) $row->amount, 2),
            ]);

        $payables = DB::table('parties')
            ->where('parties.category', PartyCategory::Supplier->value)
            ->whereNull('parties.deleted_at')
            ->select('parties.id', 'parties.name', 'parties.category')
            ->selectRaw(
                '(select coalesce(sum(pi.quantity * pi.unit_price), 0) from purchase_items pi inner join purchases pu on pu.id = pi.purchase_id where pu.party_id = parties.id and pu.deleted_at is null)'
                .' - (select coalesce(sum(p.amount), 0) from payments p where p.party_id = parties.id and p.deleted_at is null and p.type in (?, ?)) as amount',
                [PaymentType::Payment->value, PaymentType::Advance->value],
            )
            ->get()
            ->map(fn (object $row): array => [
                'id' => (int) $row->id,
                'name' => (string) $row->name,
                'category' => (string) $row->category,
                'kind' => 'payable',
                'amount' => round((float) $row->amount, 2),
            ]);

        return $receivables
            ->merge($payables)
            ->filter(fn (array $balance): bool => $balance['amount'] > 0)
            ->sortByDesc('amount')
            ->take(5)
            ->values();
    }
}
