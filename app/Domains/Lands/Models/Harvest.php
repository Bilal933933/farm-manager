<?php

namespace App\Domains\Lands\Models;

use App\Domains\Sales\Models\Sale;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Harvest extends Model
{
    protected $fillable = [
        'land_season_id',
        'date',
        'name',
        'quantity',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'quantity' => 'decimal:2',
        ];
    }

    public function landSeason(): BelongsTo
    {
        return $this->belongsTo(LandSeason::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }
}
