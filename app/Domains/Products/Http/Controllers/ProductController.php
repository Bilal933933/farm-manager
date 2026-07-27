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
        try {
            $action->execute($request->validated());

            $this->success('تم إضافة المنتج بنجاح');
        } catch (\Throwable $e) {
            $this->error('حدث خطأ أثناء إضافة المنتج');
            report($e);
        }

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
        try {
            $action->execute($product, $request->validated());

            $this->success('تم تحديث المنتج بنجاح');
        } catch (\Throwable $e) {
            $this->error('حدث خطأ أثناء تحديث المنتج');
            report($e);
        }

        return redirect()->route('products.index');
    }

    public function destroy(Product $product, DeleteProduct $action): RedirectResponse
    {
        try {
            $action->execute($product);

            $this->success('تم حذف المنتج بنجاح');
        } catch (\Throwable $e) {
            $this->error('حدث خطأ أثناء حذف المنتج');
            report($e);
        }

        return redirect()->route('products.index');
    }
}
