<?php

namespace App\Domains\StockMovements\Requests;

use App\Domains\StockMovements\Enums\MovementType;
use App\Domains\StockMovements\Models\StockMovement;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ConsumeStockRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'land_season_id' => ['required', 'exists:land_seasons,id'],
            'quantity' => ['required', 'numeric', 'min:0.01'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'date' => ['required', 'date'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $productId = $this->input('product_id');
            $quantity = (float) $this->input('quantity');

            if (! $productId || $quantity <= 0) {
                return;
            }

            $balance = $this->currentStockBalance((int) $productId);

            if ($quantity > $balance) {
                $validator->errors()->add(
                    'quantity',
                    "الكمية المطلوب صرفها ({$quantity}) أكبر من الرصيد المتاح في المخزون ({$balance})."
                );
            }
        });
    }

    private function currentStockBalance(int $productId): float
    {
        $in = StockMovement::where('product_id', $productId)
            ->where('type', MovementType::In->value)
            ->sum('quantity');

        $out = StockMovement::where('product_id', $productId)
            ->where('type', MovementType::Out->value)
            ->sum('quantity');

        return (float) $in - (float) $out;
    }
}
