<?php

namespace App\Domains\Lands\Http\Controllers;

use App\Domains\Lands\Actions\RecordHarvest;
use App\Domains\Lands\Requests\StoreHarvestRequest;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class HarvestController extends Controller
{
    public function store(StoreHarvestRequest $request, RecordHarvest $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()->back();
    }
}
