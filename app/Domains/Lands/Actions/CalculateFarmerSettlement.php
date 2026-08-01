<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\ContractType;
use App\Domains\Lands\Enums\CostBearer;
use App\Domains\Lands\Enums\SettlementType;
use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Sales\Models\Sale;
use Illuminate\Support\Facades\DB;

class CalculateFarmerSettlement
{
    public function forSeason(LandSeason $season, ?array $financials = null): ?array
    {
        if (! $season->farmer_id || ! $season->farmer_contract_id) {
            return null;
        }

        $contract = $season->farmerContract;

        if (! $contract || $contract->type !== ContractType::Farmer->value) {
            return null;
        }

        if ((int) $contract->party_id !== (int) $season->farmer_id) {
            return null;
        }

        $season->loadMissing(['harvests']);

        $harvestIds = $season->harvests->pluck('id');
        $totalRevenue = $financials['total_sales'] ?? (float) Sale::whereIn('harvest_id', $harvestIds)
            ->sum(DB::raw('quantity * unit_price'));

        $sharedCost = $financials['shared_cost'] ?? (float) Cost::where('land_season_id', $season->id)
            ->where('borne_by', CostBearer::Shared->value)
            ->sum('amount');

        $farmerCost = (float) Cost::where('land_season_id', $season->id)
            ->where('borne_by', CostBearer::Farmer->value)
            ->sum('amount');

        $ownerCost = (float) Cost::where('land_season_id', $season->id)
            ->where('borne_by', CostBearer::LandOwner->value)
            ->sum('amount');

        $netRevenue = $totalRevenue - $sharedCost;

        if ($contract->settlement_type === SettlementType::Fixed->value) {
            $farmerShare = (float) $contract->amount;
            $ownerShare = $netRevenue - $farmerShare;
        } elseif ($contract->settlement_type === SettlementType::Percentage->value) {
            $percentage = (float) ($contract->share_percentage ?? 0);
            $farmerShare = $netRevenue * ($percentage / 100);
            $ownerShare = $netRevenue - $farmerShare;
        } else {
            return null;
        }

        $isDeficit = $contract->settlement_type === SettlementType::Fixed->value && $netRevenue < $farmerShare;

        $farmerShareNet = $farmerShare - $farmerCost;
        $ownerShareNet = $ownerShare - $ownerCost;

        return [
            'total_revenue' => round($totalRevenue, 2),
            'shared_cost' => round($sharedCost, 2),
            'farmer_cost' => round($farmerCost, 2),
            'owner_cost' => round($ownerCost, 2),
            'net_revenue' => round($netRevenue, 2),
            'settlement_type' => $contract->settlement_type,
            'share_percentage' => $contract->share_percentage ? (float) $contract->share_percentage : null,
            'farmer_share' => round($farmerShare, 2),
            'owner_share' => round($ownerShare, 2),
            'farmer_share_net' => round($farmerShareNet, 2),
            'owner_share_net' => round($ownerShareNet, 2),
            'contract_amount' => $contract->settlement_type === SettlementType::Fixed->value ? (float) $contract->amount : null,
            'is_deficit' => $isDeficit,
        ];
    }
}
