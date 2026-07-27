<?php

namespace App\Domains\Sales\Http\Controllers;

use App\Domains\Harvests\Models\Harvest;
use App\Domains\Parties\Models\Party;
use App\Domains\Sales\Actions\CreateSale;
use App\Domains\Sales\Models\Sale;
use App\Domains\Sales\Requests\StoreSaleRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function index(): Response
    {
        $sales = Sale::with(['party', 'harvest.landSeason.land', 'harvest.landSeason.crop'])
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
            'parties' => Party::orderBy('name')->get(),
        ]);
    }

    public function store(StoreSaleRequest $request, CreateSale $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->route('sales.index');
    }

    public function show(Sale $sale): Response
    {
        $sale->load(['party', 'harvest.landSeason.land', 'harvest.landSeason.crop']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }
}
