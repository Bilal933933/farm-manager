<?php

namespace App\Domains\Payments\Http\Controllers;

use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Actions\RecordPayment;
use App\Domains\Payments\Actions\UpdatePayment;
use App\Domains\Payments\Models\Payment;
use App\Domains\Payments\Requests\StorePaymentRequest;
use App\Domains\Payments\Requests\UpdatePaymentRequest;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    use ToastResponse;

    public function index(): Response
    {
        $payments = Payment::with('party', 'contract.land')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create(Request $request): Response
    {
        $contracts = LandContract::with('party', 'land')->get()->map(fn ($c) => [
            'id' => $c->id,
            'type' => $c->type,
            'amount' => (float) $c->amount,
            'paid_amount' => $c->paid_amount,
            'remaining' => $c->remaining,
            'party' => ['id' => $c->party->id, 'name' => $c->party->name],
            'land' => ['id' => $c->land->id, 'name' => $c->land->name],
        ]);

        $seasons = LandSeason::with('land')
            ->whereNotNull('farmer_id')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'farmer_id' => $s->farmer_id,
                'label' => $s->land->name.' - '.$s->crop,
            ]);

        return Inertia::render('Payments/Create', [
            'parties' => Party::orderBy('name')->get(),
            'contracts' => $contracts,
            'seasons' => $seasons,
            'initialPartyId' => $request->query('party_id', ''),
            'initialContractId' => $request->query('contract_id', ''),
        ]);
    }

    public function store(StorePaymentRequest $request, RecordPayment $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($request->validated()),
            'تم تسجيل الدفعة بنجاح',
            'حدث خطأ أثناء تسجيل الدفعة',
        );

        return redirect()->route('payments.index');
    }

    public function show(Payment $payment): Response
    {
        $payment->load('party', 'contract.land');

        return Inertia::render('Payments/Show', [
            'payment' => $payment,
        ]);
    }

    public function edit(Payment $payment): Response
    {
        $payment->load('party', 'contract.land', 'landSeason');

        $contracts = LandContract::with('party', 'land')->get()->map(fn ($c) => [
            'id' => $c->id,
            'type' => $c->type,
            'amount' => (float) $c->amount,
            'paid_amount' => $c->paid_amount,
            'remaining' => $c->remaining,
            'party' => ['id' => $c->party->id, 'name' => $c->party->name],
            'land' => ['id' => $c->land->id, 'name' => $c->land->name],
        ]);

        $seasons = LandSeason::with('land')
            ->whereNotNull('farmer_id')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'farmer_id' => $s->farmer_id,
                'label' => $s->land->name.' - '.$s->crop,
            ]);

        return Inertia::render('Payments/Edit', [
            'payment' => $payment,
            'parties' => Party::orderBy('name')->get(),
            'contracts' => $contracts,
            'seasons' => $seasons,
        ]);
    }

    public function update(Payment $payment, UpdatePaymentRequest $request, UpdatePayment $action): RedirectResponse
    {
        $this->executeWithToast(
            fn () => $action->execute($payment, $request->validated()),
            'تم تحديث الدفعة بنجاح',
            'حدث خطأ أثناء تحديث الدفعة',
        );

        return redirect()->route('payments.show', $payment);
    }
}
