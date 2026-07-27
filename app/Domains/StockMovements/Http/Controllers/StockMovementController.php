<?php

namespace App\Domains\StockMovements\Http\Controllers;

use App\Domains\Lands\Models\Land;
use App\Domains\Products\Models\Product;
use App\Domains\StockMovements\Actions\ConsumeProductForSeason;
use App\Domains\StockMovements\Actions\RecordMovement;
use App\Domains\StockMovements\Models\StockMovement;
use App\Domains\StockMovements\Requests\ConsumeStockRequest;
use App\Domains\StockMovements\Requests\StoreMovementRequest;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{
    use ToastResponse;

    public function index(Request $request): Response
    {
        $movements = StockMovement::with('product')
            ->orderBy('movement_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(fn ($m) => $m->product->name);

        $products = Product::query()
            ->orderBy('display_order')
            ->orderBy('name')
            ->get();

        $lands = Land::with(['seasons' => function ($q) {
            $q->whereIn('status', ['نشط', 'قادم'])->orderBy('planting_date', 'desc');
        }])->orderBy('name')->get();

        return Inertia::render('StockMovements/Index', [
            'movements' => $movements,
            'products' => $products,
            'lands' => $lands,
        ]);
    }

    public function store(StoreMovementRequest $request, RecordMovement $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم تسجيل حركة المخزون بنجاح',
            'حدث خطأ أثناء تسجيل حركة المخزون',
        );

        return redirect()->route('stock.index');
    }

    public function consume(ConsumeStockRequest $request, ConsumeProductForSeason $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم صرف المنتج بنجاح',
            'حدث خطأ أثناء صرف المنتج',
        );

        return redirect()->back();
    }
}
