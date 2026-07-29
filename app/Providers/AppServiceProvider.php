<?php

namespace App\Providers;

use App\Domains\Common\Enums\ReferenceType;
use App\Domains\Lands\Models\LandSeason;
use App\Domains\Payments\Models\Payment;
use App\Domains\Purchases\Models\Purchase;
use App\Domains\Sales\Models\Sale;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureMorphMap();
        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureMorphMap(): void
    {
        Relation::enforceMorphMap([
            ReferenceType::LandSeason->value => LandSeason::class,
            ReferenceType::Purchase->value => Purchase::class,
            ReferenceType::Sale->value => Sale::class,
            ReferenceType::Payment->value => Payment::class,
        ]);
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
