<?php

namespace App\Domains\Products\Models;

use App\Domains\Products\Enums\ProductCategory;
use App\Domains\Products\Enums\ProductStatus;
use App\Domains\Products\Enums\ProductUnit;
use App\Domains\StockMovements\Enums\MovementType;
use App\Domains\StockMovements\Models\StockMovement;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'category',
        'unit',
        'status',
        'display_order',
        'last_purchase_price',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'category' => ProductCategory::class,
            'unit' => ProductUnit::class,
            'status' => ProductStatus::class,
            'last_purchase_price' => 'decimal:2',
        ];
    }

    protected $attributes = [
        'status' => 'نشط',
        'display_order' => 0,
    ];

    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    public function stockBalance(): float
    {
        $in = $this->stockMovements()
            ->where('type', MovementType::In->value)
            ->sum('quantity');

        $out = $this->stockMovements()
            ->where('type', MovementType::Out->value)
            ->sum('quantity');

        return (float) $in - (float) $out;
    }
}
