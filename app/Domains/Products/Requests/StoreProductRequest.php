<?php

namespace App\Domains\Products\Requests;

use App\Domains\Products\Enums\ProductCategory;
use App\Domains\Products\Enums\ProductStatus;
use App\Domains\Products\Enums\ProductUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['nullable', 'string', 'max:50', 'unique:products,code'],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(ProductCategory::class)],
            'unit' => ['required', Rule::enum(ProductUnit::class)],
            'status' => ['required', Rule::enum(ProductStatus::class)],
            'display_order' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
