<?php

namespace App\Domains\Products\Actions;

use App\Domains\Products\Models\Product;

class CreateProduct
{
    public function execute(array $data): Product
    {
        return Product::create($data);
    }
}
