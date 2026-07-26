<?php

namespace App\Domains\Parties\Http\Controllers;

use App\Domains\Parties\Actions\CreateParty;
use App\Domains\Parties\Actions\DeleteParty;
use App\Domains\Parties\Actions\UpdateParty;
use App\Domains\Parties\Models\Party;
use App\Domains\Parties\Requests\StorePartyRequest;
use App\Domains\Parties\Requests\UpdatePartyRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PartyController extends Controller
{
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
        $action->execute($request->validated());

        return redirect()->route('parties.index');
    }

    public function show(Party $party): Response
    {
        $party->load(['contracts.land']);

        return Inertia::render('Parties/Show', [
            'party' => $party,
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
        $action->execute($party, $request->validated());

        return redirect()->route('parties.index');
    }

    public function destroy(Party $party, DeleteParty $action): RedirectResponse
    {
        $action->execute($party);

        return redirect()->route('parties.index');
    }
}
