<?php

namespace App\Domains\Products\Http\Controllers;

use App\Domains\Products\Actions\CreateProduct;
use App\Domains\Products\Actions\DeleteProduct;
use App\Domains\Products\Actions\UpdateProduct;
use App\Domains\Products\Models\Product;
use App\Domains\Products\Requests\StoreProductRequest;
use App\Domains\Products\Requests\UpdateProductRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Create');
    }

    public function store(StoreProductRequest $request, CreateProduct $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('products.index');
    }

    public function show(Product $product): Response
    {
        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product, UpdateProduct $action): RedirectResponse
    {
        $action->execute($product, $request->validated());

        return redirect()->route('products.index');
    }

    public function destroy(Product $product, DeleteProduct $action): RedirectResponse
    {
        $action->execute($product);

        return redirect()->route('products.index');
    }
}
