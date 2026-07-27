<?php

namespace App\Domains\Payments\Http\Controllers;

use App\Domains\Parties\Models\Party;
use App\Domains\Payments\Actions\RecordPayment;
use App\Domains\Payments\Models\Payment;
use App\Domains\Payments\Requests\StorePaymentRequest;
use App\Http\Controllers\Controller;
use App\Support\Toast\ToastResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    use ToastResponse;

    public function index(): Response
    {
        $payments = Payment::with('party')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Payments/Create', [
            'parties' => Party::orderBy('name')->get(),
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
        $payment->load('party');

        return Inertia::render('Payments/Show', [
            'payment' => $payment,
        ]);
    }
}
