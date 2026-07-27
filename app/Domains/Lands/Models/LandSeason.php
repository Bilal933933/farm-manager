<?php

namespace App\Domains\Lands\Models;

use App\Domains\Crops\Models\Crop;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LandSeason extends Model
{
    use SoftDeletes;

    protected $fillable = ['land_id', 'crop_id', 'cultivated_area', 'crop', 'planting_date', 'harvest_date', 'expected_cost', 'actual_cost', 'actual_revenue', 'actual_profit', 'status', 'notes'];

    protected function casts(): array
    {
        return [
            'planting_date' => 'date',
            'harvest_date' => 'date',
            'expected_cost' => 'decimal:2',
            'actual_cost' => 'decimal:2',
            'actual_revenue' => 'decimal:2',
            'actual_profit' => 'decimal:2',
            'cultivated_area' => 'decimal:2',
        ];
    }

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class);
    }

    public function harvests(): HasMany
    {
        return $this->hasMany(Harvest::class);
    }

    public function costs(): HasMany
    {
        return $this->hasMany(Cost::class);
    }
}
