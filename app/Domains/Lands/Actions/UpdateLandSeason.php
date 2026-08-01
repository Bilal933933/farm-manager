<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;

class UpdateLandSeason
{
    public function execute(LandSeason $season, array $data): LandSeason
    {
        if (in_array($season->status, [SeasonStatus::Completed, SeasonStatus::Cancelled], true)) {
            throw new \RuntimeException('لا يمكن تعديل موسم في حالة "منتهي" أو "ملغي".');
        }

        unset($data['status']);

        if (! empty($data['farmer_contract_id'])) {
            $contract = LandContract::find($data['farmer_contract_id']);

            if (! $contract) {
                throw new \InvalidArgumentException('عقد المزارعة المحدد غير موجود.');
            }

            if ($contract->type !== 'مزارع') {
                throw new \InvalidArgumentException('العقد المحدد ليس عقد مزارعة.');
            }

            if ($contract->land_id !== $season->land_id) {
                throw new \InvalidArgumentException('عقد المزارعة المحدد لا ينتمي إلى هذه الأرض.');
            }

            if (! empty($data['farmer_id']) && (int) $contract->party_id !== (int) $data['farmer_id']) {
                throw new \InvalidArgumentException('عقد المزارعة المحدد لا يخص المزارع المختار.');
            }
        }

        $season->update($data);

        return $season->fresh();
    }
}
