<?php

namespace App\Domains\Purchases\Models;

use App\Domains\Parties\Models\Party;
use App\Domains\Purchases\Enums\PaymentType;
use App\Domains\StockMovements\Models\StockMovement;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'party_id',
        'date',
        'payment_type',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'payment_type' => PaymentType::class,
        ];
    }

    public function getItemsTotalAttribute(): float
    {
        return $this->items->sum(fn ($i) => $i->quantity * $i->unit_price);
    }

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function stockMovements(): MorphMany
    {
        return $this->morphMany(StockMovement::class, 'reference');
    }
}
