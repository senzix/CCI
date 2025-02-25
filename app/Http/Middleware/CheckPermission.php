<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if ($request->user()->isAdmin()) {
            return $next($request);
        }

        if (!$request->user()->hasPermission($permission)) {
            if ($request->wantsJson() || $request->ajax()) {
                return Inertia::render('Error/PermissionDenied', [
                    'error' => 'Permission denied',
                    'showModal' => true
                ])->toResponse($request)->setStatusCode(403);
            }
            
            return redirect()->back()->with('showPermissionDenied', true);
        }

        return $next($request);
    }
} 