<?php

namespace App\Domains\Products\Actions;

use App\Domains\Products\Models\Product;

class DeleteProduct
{
    public function execute(Product $product): void
    {
        $product->delete();
    }
}
