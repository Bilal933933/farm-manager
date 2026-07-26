<?php

namespace App\Domains\Products\Actions;

use App\Domains\Products\Models\Product;

class UpdateProduct
{
    public function execute(Product $product, array $data): Product
    {
        $product->update($data);

        return $product;
    }
}
