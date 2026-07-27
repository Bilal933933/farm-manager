<?php

namespace App\Domains\Lands\Actions;

use App\Domains\Lands\Models\Cost;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ListCosts
{
    public function execute(array $filters = []): LengthAwarePaginator
    {
        return Cost::query()
            ->with(['land', 'landSeason', 'crop'])
            ->when($filters['land_id'] ?? null, fn ($q, $v) => $q->where('land_id', $v))
            ->when($filters['land_season_id'] ?? null, fn ($q, $v) => $q->where('land_season_id', $v))
            ->when($filters['crop_id'] ?? null, fn ($q, $v) => $q->where('crop_id', $v))
            ->when($filters['type'] ?? null, fn ($q, $v) => $q->where('type', $v))
            ->when($filters['date_from'] ?? null, fn ($q, $v) => $q->whereDate('date', '>=', $v))
            ->when($filters['date_to'] ?? null, fn ($q, $v) => $q->whereDate('date', '<=', $v))
            ->when($filters['search'] ?? null, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('description', 'like', "%{$v}%")
                    ->orWhere('notes', 'like', "%{$v}%");
            }))
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($filters['per_page'] ?? 20);
    }
}
