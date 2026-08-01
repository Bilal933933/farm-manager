<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\CostBearer;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Sales\Models\Sale;
use Illuminate\Support\Facades\DB;

class CalculateSeasonFinancials
{
    public function forSeason(LandSeason $season): array
    {
        $season->loadMissing(['harvests']);

        $harvestIds = $season->harvests->pluck('id');
        $totalHarvest = (float) $season->harvests->sum('quantity');
        $totalSoldQty = (float) Sale::whereIn('harvest_id', $harvestIds)->sum('quantity');
        $totalSales = (float) Sale::whereIn('harvest_id', $harvestIds)->sum(DB::raw('quantity * unit_price'));
        $totalCost = (float) Cost::where('land_season_id', $season->id)->sum('amount');
        $sharedCost = (float) Cost::where('land_season_id', $season->id)->where('borne_by', CostBearer::Shared->value)->sum('amount');
        $profit = $totalSales - $totalCost;

        return [
            'total_harvest' => $totalHarvest,
            'total_sold_qty' => $totalSoldQty,
            'total_sales' => $totalSales,
            'total_cost' => $totalCost,
            'shared_cost' => $sharedCost,
            'profit' => $profit,
        ];
    }

    public function forLand(Land $land): array
    {
        $results = [];

        foreach ($land->seasons as $season) {
            $results[$season->id] = $this->forSeason($season);
        }

        return $results;
    }
}
