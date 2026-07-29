<?php

namespace App\Domains\Parties\Actions;

use App\Domains\Lands\Actions\CalculateFarmerSettlement;
use App\Domains\Parties\Models\Party;

class SummarizeFarmerSettlements
{
    public function __construct(
        private readonly CalculateFarmerSettlement $calculateFarmerSettlement,
    ) {}

    public function execute(Party $party): ?array
    {
        $seasons = $party->farmedSeasons()
            ->with(['land', 'harvests', 'farmerContract'])
            ->get();

        $settlements = [];

        foreach ($seasons as $season) {
            $result = $this->calculateFarmerSettlement->forSeason($season);

            if ($result === null) {
                continue;
            }

            $settlements[] = [
                'season_id' => $season->id,
                'land_name' => $season->land->name,
                'planting_date' => $season->planting_date->format('Y-m-d'),
                'harvest_date' => $season->harvest_date?->format('Y-m-d'),
                'settlement_type' => $result['settlement_type'],
                'share_percentage' => $result['share_percentage'],
                'total_revenue' => $result['total_revenue'],
                'shared_cost' => $result['shared_cost'],
                'farmer_cost' => $result['farmer_cost'],
                'owner_cost' => $result['owner_cost'],
                'net_revenue' => $result['net_revenue'],
                'farmer_share' => $result['farmer_share'],
                'owner_share' => $result['owner_share'],
                'farmer_share_net' => $result['farmer_share_net'],
                'owner_share_net' => $result['owner_share_net'],
                'contract_amount' => $result['contract_amount'],
            ];
        }

        if (empty($settlements)) {
            return null;
        }

        $totalFarmerShareNet = array_sum(array_column($settlements, 'farmer_share_net'));
        $totalOwnerShareNet = array_sum(array_column($settlements, 'owner_share_net'));
        $totalFarmerCost = array_sum(array_column($settlements, 'farmer_cost'));
        $totalOwnerCost = array_sum(array_column($settlements, 'owner_cost'));

        return [
            'total_farmer_share_net' => round($totalFarmerShareNet, 2),
            'total_owner_share_net' => round($totalOwnerShareNet, 2),
            'total_farmer_cost' => round($totalFarmerCost, 2),
            'total_owner_cost' => round($totalOwnerCost, 2),
            'settlements_count' => count($settlements),
            'settlements' => $settlements,
        ];
    }
}
