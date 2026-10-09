<?php

namespace App\Domains\Payments\Http\Controllers;

use App\Domains\Lands\Models\Land;
use App\Domains\Lands\Models\LandContract;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Actions\RecordPayment;
use App\Domains\Payments\Actions\UpdatePayment;
use App\Domains\Payments\Models\Payment;
use App\Domains\Payments\Requests\ListPaymentRequest;
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

    public function index(ListPaymentRequest $request): Response
    {
        $filters = $request->validated();

        $payments = Payment::with('party', 'contract.land', 'landSeason.land')
            ->when($filters['land_season_id'] ?? null, fn ($q, $v) => $q->where('land_season_id', $v))
            ->when($filters['land_id'] ?? null, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('land_season_id', function ($sub) use ($v) {
                    $sub->select('id')->from('land_seasons')->whereColumn('land_seasons.id', 'payments.land_season_id')->where('land_id', $v);
                })->orWhereHas('contract', fn ($q) => $q->where('land_id', $v));
            }))
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $seasons = LandSeason::with('land:id,name', 'crop:id,name')
            ->orderBy('planting_date', 'desc')
            ->get(['id', 'land_id', 'crop_id', 'planting_date'])
            ->map(fn ($s) => [
                'id' => $s->id,
                'land_id' => $s->land_id,
                'label' => $s->land->name.' - '.($s->crop?->name ?? $s->planting_date->format('Y-m-d')),
            ]);

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'lands' => Land::orderBy('name')->get(['id', 'name']),
            'seasons' => $seasons,
            'filters' => $filters,
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

        $seasons = LandSeason::with('land', 'crop')
            ->whereNotNull('farmer_id')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'farmer_id' => $s->farmer_id,
                'label' => $s->land->name.' - '.($s->crop?->name ?? '—'),
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

        $seasons = LandSeason::with('land', 'crop')
            ->whereNotNull('farmer_id')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'farmer_id' => $s->farmer_id,
                'label' => $s->land->name.' - '.($s->crop?->name ?? '—'),
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
