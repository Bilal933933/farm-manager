<?php

namespace App\Domains\Parties\Http\Controllers;

use App\Domains\Parties\Actions\CreateParty;
use App\Domains\Parties\Actions\DeleteParty;
use App\Domains\Parties\Actions\SummarizeAmanatFinancials;
use App\Domains\Parties\Actions\SummarizeFarmerFinancials;
use App\Domains\Parties\Actions\SummarizeLesseeFinancials;
use App\Domains\Parties\Actions\SummarizeLessorFinancials;
use App\Domains\Parties\Actions\SummarizeMerchantFinancials;
use App\Domains\Parties\Actions\SummarizeSupplierFinancials;
use App\Domains\Parties\Actions\UpdateParty;
use App\Domains\Parties\Enums\PartyCategory;
use App\Domains\Parties\Models\Party;
use App\Domains\Parties\Requests\StorePartyRequest;
use App\Domains\Parties\Requests\UpdatePartyRequest;
use App\Domains\Payments\Enums\PaymentType;
use App\Domains\Payments\Models\Payment;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PartyController extends Controller
{
    use ToastResponse;

    public function index(): Response
    {
        $parties = Party::withCount('contracts')->get();

        return Inertia::render('Parties/Index', [
            'parties' => $parties,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Parties/Create');
    }

    public function store(StorePartyRequest $request, CreateParty $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم إضافة الطرف بنجاح',
            'حدث خطأ أثناء إضافة الطرف',
        );

        return redirect()->route('parties.index');
    }

    public function show(Party $party): Response
    {
        $party->load(['contracts.land', 'payments', 'purchases.items.product', 'sales']);

        $party->purchases->each(function ($purchase) {
            $purchase->setAttribute('items_total', $purchase->items->sum(fn ($item) => $item->quantity * $item->unit_price));
            $purchase->setAttribute('items_count', $purchase->items->count());
        });

        $totalContractAmount = (float) $party->contracts()->sum('amount');

        $totalPaidTo = (float) Payment::where('party_id', $party->id)
            ->whereIn('type', [PaymentType::Payment, PaymentType::Advance])
            ->sum('amount');

        $totalReceivedFrom = (float) Payment::where('party_id', $party->id)
            ->where('type', PaymentType::Receipt)
            ->sum('amount');

        $netBalance = $totalContractAmount - $totalPaidTo + $totalReceivedFrom;

        $totalPurchases = $party->purchases->sum(fn ($p) => $p->items->sum(fn ($item) => $item->quantity * $item->unit_price));

        $totalSales = (float) $party->sales()->sum(DB::raw('quantity * unit_price'));

        $farmerFinancials = null;
        $lessorFinancials = null;
        $lesseeFinancials = null;
        $supplierFinancials = null;
        $merchantFinancials = null;
        $amanatFinancials = null;

        match ($party->category) {
            PartyCategory::Farmer => $farmerFinancials = app(SummarizeFarmerFinancials::class)->execute($party),
            PartyCategory::Lessor => $lessorFinancials = app(SummarizeLessorFinancials::class)->execute($party),
            PartyCategory::Lessee => $lesseeFinancials = app(SummarizeLesseeFinancials::class)->execute($party),
            PartyCategory::Supplier => $supplierFinancials = app(SummarizeSupplierFinancials::class)->execute($party),
            PartyCategory::Merchant => $merchantFinancials = app(SummarizeMerchantFinancials::class)->execute($party),
            PartyCategory::Amanat => $amanatFinancials = app(SummarizeAmanatFinancials::class)->execute($party),
            default => null,
        };

        return Inertia::render('Parties/Show', [
            'party' => $party,
            'summary' => [
                'totalContractAmount' => $totalContractAmount,
                'totalPaidTo' => $totalPaidTo,
                'totalReceivedFrom' => $totalReceivedFrom,
                'netBalance' => $netBalance,
                'totalPurchases' => $totalPurchases,
                'totalSales' => $totalSales,
            ],
            'farmerFinancials' => $farmerFinancials,
            'lessorFinancials' => $lessorFinancials,
            'lesseeFinancials' => $lesseeFinancials,
            'supplierFinancials' => $supplierFinancials,
            'merchantFinancials' => $merchantFinancials,
            'amanatFinancials' => $amanatFinancials,
        ]);
    }

    public function edit(Party $party): Response
    {
        return Inertia::render('Parties/Edit', [
            'party' => $party,
        ]);
    }

    public function update(UpdatePartyRequest $request, Party $party, UpdateParty $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($party, $request->validated()),
            'تم تحديث الطرف بنجاح',
            'حدث خطأ أثناء تحديث الطرف',
        );

        return redirect()->route('parties.index');
    }

    public function destroy(Party $party, DeleteParty $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($party),
            'تم حذف الطرف بنجاح',
            'حدث خطأ أثناء حذف الطرف',
        );

        return redirect()->route('parties.index');
    }
}
