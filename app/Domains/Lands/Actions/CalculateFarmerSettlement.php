<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Sales\Models\Sale;
use Illuminate\Support\Facades\DB;

class CalculateFarmerSettlement
{
    public function forSeason(LandSeason $season): ?array
    {
        if (! $season->farmer_id || ! $season->farmer_contract_id) {
            return null;
        }

        $contract = LandContract::find($season->farmer_contract_id);

        if (! $contract || $contract->type !== 'مزارع') {
            return null;
        }

        $season->loadMissing(['harvests']);

        $harvestIds = $season->harvests->pluck('id');
        $totalRevenue = (float) Sale::whereIn('harvest_id', $harvestIds)
            ->sum(DB::raw('quantity * unit_price'));

        $sharedCost = (float) Cost::where('land_season_id', $season->id)
            ->where('borne_by', 'مشترك')
            ->sum('amount');

        $farmerCost = (float) Cost::where('land_season_id', $season->id)
            ->where('borne_by', 'مزارع')
            ->sum('amount');

        $ownerCost = (float) Cost::where('land_season_id', $season->id)
            ->where('borne_by', 'مالك')
            ->sum('amount');

        $netRevenue = $totalRevenue - $sharedCost;

        if ($contract->settlement_type === 'ثابت') {
            $farmerShare = (float) $contract->amount;
            $ownerShare = $netRevenue - $farmerShare;
        } elseif ($contract->settlement_type === 'نسبة') {
            $percentage = (float) ($contract->share_percentage ?? 0);
            $farmerShare = $netRevenue * ($percentage / 100);
            $ownerShare = $netRevenue - $farmerShare;
        } else {
            return null;
        }

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
            'contract_amount' => $contract->settlement_type === 'ثابت' ? (float) $contract->amount : null,
        ];
    }
}
