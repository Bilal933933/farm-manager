<?php

namespace App\Domains\Purchases\Requests;

use App\Domains\Purchases\Enums\PaymentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'party_id' => ['required', 'exists:parties,id'],
            'date' => ['required', 'date'],
            'payment_type' => ['required', Rule::enum(PaymentType::class)],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'يجب إضافة بند واحد على الأقل.',
            'items.*.product_id.required' => 'يجب اختيار الصنف.',
            'items.*.quantity.min' => 'الكمية يجب أن تكون أكبر من صفر.',
        ];
    }
}
