<?php

namespace App\Domains\StockMovements\Models;

use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Products\Models\Product;
use App\Domains\StockMovements\Enums\MovementReason;
use App\Domains\StockMovements\Enums\MovementType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StockMovement extends Model
{
    protected $fillable = [
        'product_id',
        'land_id',
        'land_season_id',
        'type',
        'reason',
        'quantity',
        'unit_price',
        'movement_date',
        'reference_type',
        'reference_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'type' => MovementType::class,
            'reason' => MovementReason::class,
            'quantity' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'movement_date' => 'date',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function landSeason(): BelongsTo
    {
        return $this->belongsTo(LandSeason::class);
    }
}
