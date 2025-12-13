<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Admin guard redirects
        $middleware->redirectGuestsTo(fn ($request) => 
            ($request->is('admin/*') || $request->is('admin')) ? route('login') : route('applicant.login')
        );
        
        $middleware->redirectUsersTo(fn ($request) => 
            auth()->guard('applicant')->check() ? route('applicant.dashboard') : route('admin.dashboard')
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
