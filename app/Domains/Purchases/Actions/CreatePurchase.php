<?php

namespace App\Domains\Purchases\Actions;

use App\Domains\Ledger\Actions\RecordLedgerEntry;
use App\Domains\Ledger\Enums\LedgerDirection;
use App\Domains\Products\Models\Product;
use App\Domains\Purchases\Models\Purchase;
use App\Domains\StockMovements\Actions\RecordMovement;
use App\Domains\StockMovements\Enums\MovementReason;
use App\Domains\StockMovements\Enums\MovementType;
use Illuminate\Support\Facades\DB;

class CreatePurchase
{
    public function __construct(
        private RecordMovement $recordMovement,
        private RecordLedgerEntry $recordLedgerEntry,
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

            $itemsTotal = 0;

            foreach ($data['items'] as $item) {
                $purchaseItem = $purchase->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);

                $itemsTotal += $item['quantity'] * $item['unit_price'];

                $this->recordMovement->execute([
                    'product_id' => $item['product_id'],
                    'type' => MovementType::In->value,
                    'reason' => MovementReason::Purchase->value,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'movement_date' => $data['date'],
                    'reference_type' => Purchase::class,
                    'reference_id' => $purchase->id,
                    'land_id' => $data['land_id'] ?? null,
                    'land_season_id' => $data['land_season_id'] ?? null,
                ]);

                Product::withoutTimestamps(fn () => Product::where('id', $item['product_id'])->update([
                    'last_purchase_price' => $item['unit_price'],
                ]));
            }

            if ($data['payment_type'] === 'آجل') {
                $this->recordLedgerEntry->execute([
                    'date' => $data['date'],
                    'direction' => LedgerDirection::Credit->value,
                    'amount' => $itemsTotal,
                    'description' => 'مشتريات آجلة فاتورة #'.$purchase->id,
                    'party_id' => $data['party_id'],
                    'reference_type' => Purchase::class,
                    'reference_id' => $purchase->id,
                ]);
            }

            return $purchase;
        });
    }
}
