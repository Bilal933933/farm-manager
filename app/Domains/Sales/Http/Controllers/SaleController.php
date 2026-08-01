<?php

namespace App\Domains\Sales\Http\Controllers;

use App\Domains\Lands\Models\Harvest;
use App\Domains\Lands\Models\Land;
use App\Domains\Parties\Models\Party;
use App\Domains\Sales\Actions\CreateSale;
use App\Domains\Sales\Models\Sale;
use App\Domains\Sales\Requests\StoreSaleRequest;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    use ToastResponse;

    public function index(): Response
    {
        $sales = Sale::with(['party', 'harvest.landSeason.land', 'harvest.landSeason.crop', 'attachments'])
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
        ]);
    }

    public function create(): Response
    {
        $harvests = Harvest::with('landSeason.land', 'landSeason.crop')
            ->orderBy('date', 'desc')
            ->get();

        return Inertia::render('Sales/Create', [
            'harvests' => $harvests,
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'parties' => Party::orderBy('name')->get(),
        ]);
    }

    public function store(StoreSaleRequest $request, CreateSale $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم تسجيل البيع بنجاح',
            'حدث خطأ أثناء تسجيل البيع',
        );

        return redirect()->back();
    }

    public function show(Sale $sale): Response
    {
        $sale->load(['party', 'harvest.landSeason.land', 'harvest.landSeason.crop', 'attachments']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }
}
