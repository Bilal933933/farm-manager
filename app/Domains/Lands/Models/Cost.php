<?php

namespace App\Domains\Lands\Models;

use App\Domains\Crops\Models\Crop;
use App\Domains\Lands\Enums\CostBearer;
use App\Domains\Products\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cost extends Model
{
    use HasFactory;
    use SoftDeletes;

    /*
     * Deletion strategy:
     * - land_season_id: cascadeOnDelete (season owns the cost)
     * - crop_id, product_id: nullOnDelete (reference only, cost survives)
     */

    protected $fillable = ['land_id', 'land_season_id', 'crop_id', 'product_id', 'quantity', 'borne_by', 'type', 'description', 'amount', 'date', 'notes'];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'quantity' => 'decimal:2',
            'borne_by' => CostBearer::class,
            'date' => 'date',
        ];
    }

    public function land(): BelongsTo
    {
        return $this->belongsTo(Land::class);
    }

    public function landSeason(): BelongsTo
    {
        return $this->belongsTo(LandSeason::class);
    }

    public function crop(): BelongsTo
    {
        return $this->belongsTo(Crop::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
