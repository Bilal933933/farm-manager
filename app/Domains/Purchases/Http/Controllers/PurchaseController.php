<?php

namespace App\Domains\Purchases\Http\Controllers;

use App\Domains\Parties\Models\Party;
use App\Domains\Products\Models\Product;
use App\Domains\Purchases\Actions\CreatePurchase;
use App\Domains\Purchases\Models\Purchase;
use App\Domains\Purchases\Requests\StorePurchaseRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function index(): Response
    {
        $purchases = Purchase::with('party', 'items.product')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($purchase) {
                $purchase->setAttribute('items_count', $purchase->items->count());
                $purchase->setAttribute('items_total', $purchase->items->sum(fn ($item) => $item->quantity * $item->unit_price));

                return $purchase;
            });

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
        ]);
    }

    public function create(): Response
    {
        $products = Product::query()
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Purchases/Create', [
            'parties' => Party::orderBy('name')->get(),
            'products' => $products,
        ]);
    }

    public function store(StorePurchaseRequest $request, CreatePurchase $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('purchases.index');
    }

    public function show(Purchase $purchase): Response
    {
        $purchase->load(['party', 'items.product', 'stockMovements']);

        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase,
        ]);
    }
}
