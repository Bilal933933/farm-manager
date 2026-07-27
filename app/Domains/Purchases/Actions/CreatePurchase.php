<?php

namespace App\Domains\Purchases\Actions;

use App\Domains\Purchases\Models\Purchase;
use App\Domains\StockMovements\Actions\RecordMovement;
use App\Domains\StockMovements\Enums\MovementReason;
use App\Domains\StockMovements\Enums\MovementType;
use Illuminate\Support\Facades\DB;

class CreatePurchase
{
    public function __construct(
        private RecordMovement $recordMovement,
    ) {}

    public function execute(array $data): Purchase
    {
        return DB::transaction(function () use ($data) {
            $purchase = Purchase::create([
                'party_id' => $data['party_id'],
                'date' => $data['date'],
                'payment_type' => $data['payment_type'],
                'notes' => $data['notes'] ?? null,
            ]);

            foreach ($data['items'] as $item) {
                $purchaseItem = $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);

                $this->recordMovement->execute([
                    'product_id' => $item['product_id'],
                    'type' => MovementType::In->value,
                    'reason' => MovementReason::Purchase->value,
                    'quantity' => $item['quantity'],
                    'movement_date' => $data['date'],
                    'reference_type' => Purchase::class,
                    'reference_id' => $purchase->id,
                ]);
            }

            return $purchase;
        });
    }
}
