<?php

use App\Models\User as AppUser;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;

// ─── Redirect ─────────────────────────────────────────────

test('google redirect sends the user to google', function () {
    Socialite::fake('google');

    $response = $this->get(route('auth.google.redirect'));

    $response->assertRedirect('https://socialite.fake/google/authorize');
});

// ─── Callback ─────────────────────────────────────────────

test('google callback creates a new user and logs them in', function () {
    Socialite::fake('google', SocialiteUser::fake([
        'id' => 'google-123',
        'name' => 'أحمد علي',
        'email' => 'ahmed@example.com',
        'avatar' => 'https://example.com/avatar.jpg',
    ]));

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticated();

    $user = AppUser::where('email', 'ahmed@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->google_id)->toBe('google-123')
        ->and($user->avatar)->toBe('https://example.com/avatar.jpg')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->password)->not->toBeNull();
});

test('google callback links an existing user by email', function () {
    $user = AppUser::factory()->create([
        'email' => 'existing@example.com',
        'google_id' => null,
    ]);

    Socialite::fake('google', SocialiteUser::fake([
        'id' => 'google-456',
        'email' => 'existing@example.com',
    ]));

    $this->get(route('auth.google.callback'));

    $this->assertAuthenticatedAs($user);
    expect($user->fresh()->google_id)->toBe('google-456');
});

test('google callback uses the avatar from the google profile when not provided', function () {
    Socialite::fake('google', SocialiteUser::fake([
        'id' => 'google-789',
        'email' => 'avatar@example.com',
        'avatar' => null,
    ]));

    Http::fake([
        'https://www.googleapis.com/oauth2/v3/userinfo*' => Http::response(['picture' => 'https://example.com/picture.jpg'], 200),
    ]);

    $this->get(route('auth.google.callback'));

    $user = AppUser::where('email', 'avatar@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->avatar)->toBe('https://example.com/picture.jpg');
});

test('google callback failure redirects to login with an error', function () {
    Socialite::fake('google', function () {
        throw new Exception('Google denied access');
    });

    $response = $this->get(route('auth.google.callback'));

    $response->assertRedirect(route('login'))
        ->assertSessionHas('error');
    $this->assertGuest();
});
