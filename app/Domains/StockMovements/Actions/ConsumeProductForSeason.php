<?php

namespace App\Domains\StockMovements\Actions;

use App\Domains\Common\Enums\ReferenceType;
use App\Domains\Lands\Actions\CreateCost;
use App\Domains\Lands\Enums\CostType;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Products\Enums\ProductCategory;
use App\Domains\Products\Models\Product;
use App\Domains\StockMovements\Enums\MovementReason;
use App\Domains\StockMovements\Enums\MovementType;
use App\Domains\StockMovements\Models\StockMovement;
use Illuminate\Support\Facades\DB;

class ConsumeProductForSeason
{
    public function __construct(
        private readonly RecordMovement $recordMovement,
        private readonly CreateCost $createCost,
    ) {}

    public function execute(array $data): StockMovement
    {
        return DB::transaction(function () use ($data) {
            $product = Product::findOrFail($data['product_id']);
            $season = LandSeason::findOrFail($data['land_season_id']);

            $quantity = (float) $data['quantity'];
            $unitPrice = (float) $data['unit_price'];

            $movement = $this->recordMovement->execute([
                'product_id' => $product->id,
                'type' => MovementType::Out->value,
                'reason' => MovementReason::SeasonConsumption->value,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'movement_date' => $data['date'],
                'reference_type' => ReferenceType::LandSeason->value,
                'reference_id' => $season->id,
                'notes' => $data['notes'] ?? null,
            ]);

            $this->createCost->execute([
                'land_id' => $season->land_id,
                'land_season_id' => $season->id,
                'crop_id' => $season->crop_id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'type' => $this->mapProductCategoryToCostType($product->category)->value,
                'description' => "صرف {$quantity} {$product->unit->value} من {$product->name}",
                'amount' => $quantity * $unitPrice,
                'date' => $data['date'],
                'notes' => $data['notes'] ?? null,
            ]);

            return $movement;
        });
    }

    private function mapProductCategoryToCostType(?ProductCategory $category): CostType
    {
        return match ($category) {
            ProductCategory::Fertilizer => CostType::Fertilizers,
            ProductCategory::Pesticide => CostType::Pesticides,
            ProductCategory::Seeds => CostType::Seeds,
            ProductCategory::Irrigation => CostType::Irrigation,
            default => CostType::Other,
        };
    }
}
