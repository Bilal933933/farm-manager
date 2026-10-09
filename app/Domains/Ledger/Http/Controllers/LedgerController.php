<?php

namespace App\Domains\Ledger\Http\Controllers;

use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Ledger\Models\LedgerEntry;
use App\Domains\Ledger\Requests\ListLedgerRequest;
use App\Domains\Payments\Models\Payment;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LedgerController extends Controller
{
    public function index(ListLedgerRequest $request): Response
    {
        $filters = $request->validated();

        $entries = LedgerEntry::with('party')
            ->when($filters['land_season_id'] ?? null, function ($q, $v) {
                $q->whereHasMorph('reference', [Payment::class], fn ($q) => $q->where('land_season_id', $v));
            })
            ->when($filters['land_id'] ?? null, function ($q, $v) {
                $q->whereHasMorph('reference', [Payment::class], function ($q) use ($v) {
                    $q->where(function ($q) use ($v) {
                        $q->where('land_season_id', function ($sub) use ($v) {
                            $sub->select('id')->from('land_seasons')->whereColumn('land_seasons.id', 'payments.land_season_id')->where('land_id', $v);
                        })->orWhereHas('contract', fn ($q) => $q->where('land_id', $v));
                    });
                });
            })
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $seasons = LandSeason::with('land:id,name', 'crop:id,name')
            ->orderBy('planting_date', 'desc')
            ->get(['id', 'land_id', 'crop_id', 'planting_date'])
            ->map(fn ($s) => [
                'id' => $s->id,
                'land_id' => $s->land_id,
                'label' => $s->land->name.' - '.($s->crop?->name ?? $s->planting_date->format('Y-m-d')),
            ]);

        return Inertia::render('Ledger/Index', [
            'entries' => $entries,
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'seasons' => $seasons,
            'filters' => $filters,
        ]);
    }
}
