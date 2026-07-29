<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Lands\Actions\CalculateFarmerSettlement;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;

class SummarizeFarmerFinancials
{
    public function __construct(
        private readonly CalculateFarmerSettlement $calculateFarmerSettlement,
    ) {}

    public function execute(Party $party): ?array
    {
        $seasons = $party->farmedSeasons()
            ->with(['land', 'harvests', 'farmerContract'])
            ->get();

        $seasonsData = [];
        $totalProfit = 0;
        $totalAdvances = 0;
        $totalFarmerShareNet = 0;

        foreach ($seasons as $season) {
            $result = $this->calculateFarmerSettlement->forSeason($season);

            if ($result === null) {
                continue;
            }

            $advances = (float) Payment::where('party_id', $party->id)
                ->where('type', PaymentType::Advance)
                ->where('land_season_id', $season->id)
                ->sum('amount');

            $profit = $result['farmer_share_net'] - $advances;

            $seasonsData[] = [
                'season_id' => $season->id,
                'land_name' => $season->land->name,
                'planting_date' => $season->planting_date->format('Y-m-d'),
                'harvest_date' => $season->harvest_date?->format('Y-m-d'),
                'settlement_type' => $result['settlement_type'],
                'share_percentage' => $result['share_percentage'],
                'total_revenue' => $result['total_revenue'],
                'shared_cost' => $result['shared_cost'],
                'farmer_cost' => $result['farmer_cost'],
                'farmer_share' => $result['farmer_share'],
                'farmer_share_net' => $result['farmer_share_net'],
                'advances' => round($advances, 2),
                'profit' => round($profit, 2),
            ];

            $totalProfit += $profit;
            $totalAdvances += $advances;
            $totalFarmerShareNet += $result['farmer_share_net'];
        }

        if (empty($seasonsData)) {
            return null;
        }

        return [
            'total_revenue' => round(array_sum(array_column($seasonsData, 'total_revenue')), 2),
            'total_shared_cost' => round(array_sum(array_column($seasonsData, 'shared_cost')), 2),
            'total_farmer_share' => round(array_sum(array_column($seasonsData, 'farmer_share')), 2),
            'total_farmer_share_net' => round($totalFarmerShareNet, 2),
            'total_advances' => round($totalAdvances, 2),
            'total_profit' => round($totalProfit, 2),
            'seasons_count' => count($seasonsData),
            'seasons' => $seasonsData,
        ];
    }
}
