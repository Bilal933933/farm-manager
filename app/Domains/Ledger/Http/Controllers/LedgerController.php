<?php

namespace App\Domains\Ledger\Http\Controllers;

use App\Domains\Ledger\Models\LedgerEntry;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class LedgerController extends Controller
{
    public function index(): Response
    {
        $entries = LedgerEntry::with('party')
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Ledger/Index', [
            'entries' => $entries,
        ]);
    }
}
