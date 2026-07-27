<?php

namespace App\Domains\Products\Http\Controllers;

use App\Domains\Products\Actions\CreateProduct;
use App\Domains\Products\Actions\DeleteProduct;
use App\Domains\Products\Actions\UpdateProduct;
use App\Domains\Products\Models\Product;
use App\Domains\Products\Requests\StoreProductRequest;
use App\Domains\Products\Requests\UpdateProductRequest;
use App\Domains\StockMovements\Enums\MovementType;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    use ToastResponse;

    public function index(): Response
    {
        $products = Product::query()
            ->withSum(['stockMovements as stock_in' => fn ($q) => $q->where('type', MovementType::In->value)], 'quantity')
            ->withSum(['stockMovements as stock_out' => fn ($q) => $q->where('type', MovementType::Out->value)], 'quantity')
            ->orderBy('display_order')
            ->orderBy('name')
            ->get()
            ->map(fn (Product $product) => array_merge($product->toArray(), [
                'stock_balance' => (float) ($product->stock_in ?? 0) - (float) ($product->stock_out ?? 0),
            ]));

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
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم إضافة المنتج بنجاح',
            'حدث خطأ أثناء إضافة المنتج',
        );

        return redirect()->route('products.index');
    }

    public function show(Product $product): Response
    {
        $product->load(['stockMovements' => fn ($q) => $q->with('reference')->latest('movement_date')->latest('created_at')]);

        $product->stock_balance = (float) $product->stockMovements
            ->where('type', MovementType::In->value)->sum('quantity')
            - (float) $product->stockMovements
                ->where('type', MovementType::Out->value)->sum('quantity');

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
        $this->executeWithToast(
            fn () => $action->execute($product, $request->validated()),
            'تم تحديث المنتج بنجاح',
            'حدث خطأ أثناء تحديث المنتج',
        );

        return redirect()->route('products.index');
    }

    public function destroy(Product $product, DeleteProduct $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($product),
            'تم حذف المنتج بنجاح',
            'حدث خطأ أثناء حذف المنتج',
        );

        return redirect()->route('products.index');
    }
}
