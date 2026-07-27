<?php

namespace App\Domains\Sales\Models;

use App\Domains\Harvests\Models\Harvest;
use App\Domains\Parties\Models\Party;
use App\Domains\Sales\Enums\SaleType;
use App\Domains\StockMovements\Models\StockMovement;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'harvest_id',
        'party_id',
        'quantity',
        'unit_price',
        'date',
        'payment_type',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'quantity' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'payment_type' => SaleType::class,
        ];
    }

    public function harvest(): BelongsTo
    {
        return $this->belongsTo(Harvest::class);
    }

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }

    public function stockMovements(): MorphMany
    {
        return $this->morphMany(StockMovement::class, 'reference');
    }
}
