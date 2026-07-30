<?php

namespace App\Domains\Lands\Models;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Enums\SeasonStatus;
use App\Domains\Parties\Models\Party;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LandSeason extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = ['land_id', 'crop_id', 'cultivated_area', 'planting_date', 'harvest_date', 'expected_cost', 'actual_cost', 'actual_revenue', 'actual_profit', 'completed_at', 'status', 'notes', 'farmer_id', 'farmer_contract_id'];

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
            'completed_at' => 'datetime',
            'status' => SeasonStatus::class,
        ];
    }

    public function actualProfit(): Attribute
    {
        return Attribute::make(
            get: fn (?float $value) => $value ?? (($this->actual_revenue ?? 0) - ($this->actual_cost ?? 0)),
        );
    }

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class);
    }

    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Party::class, 'farmer_id');
    }

    public function farmerContract(): BelongsTo
    {
        return $this->belongsTo(LandContract::class, 'farmer_contract_id');
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
