<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Session;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionController extends Controller
{
    /**
     * List all sessions.
     */
    public function index()
    {
        $sessions = Session::withCount('applicants')
            ->orderBy('year_start', 'desc')
            ->get();

        // Get active session ID from database
        $activeSession = Session::where('is_active', true)->first();

        return Inertia::render('Admin/Sessions/Index', [
            'sessions' => $sessions,
            'activeSessionId' => $activeSession?->id,
        ]);
    }

    /**
     * Show create session form.
     */
    public function create()
    {
        return Inertia::render('Admin/Sessions/Create');
    }

    /**
     * Store new session.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'session_name' => 'required|string|max:255',
            'use_season' => 'boolean',
            'season' => 'nullable|required_if:use_season,true|in:summer,winter',
            'year_start' => 'required|integer|min:2020|max:2100',
            'year_end' => 'nullable|integer|min:2020|max:2100|gte:year_start',
            'is_active' => 'boolean',
        ]);

        // Set use_season default if not provided
        $validated['use_season'] = $validated['use_season'] ?? false;

        // Check for duplicate session combination
        $query = Session::where('year_start', $validated['year_start'])
            ->where('season', $validated['season'] ?? null)
            ->where('use_season', $validated['use_season']);
        
        if (isset($validated['year_end'])) {
            $query->where('year_end', $validated['year_end']);
        } else {
            $query->whereNull('year_end');
        }
        
        $exists = $query->exists();

        if ($exists) {
            return back()->withErrors(['session_name' => 'This session configuration already exists.']);
        }

        // If new session is active, deactivate others
        if ($validated['is_active'] ?? false) {
            Session::where('is_active', true)->update(['is_active' => false]);
        }

        Session::create($validated);

        return redirect()->route('admin.sessions.index')
            ->with('success', 'Session created successfully.');
    }

    /**
     * Show edit session form.
     */
    public function edit(Session $session)
    {
        $session->loadCount('applicants');

        return Inertia::render('Admin/Sessions/Edit', [
            'session' => $session,
        ]);
    }

    /**
     * Update session.
     */
    public function update(Request $request, Session $session)
    {
        $validated = $request->validate([
            'session_name' => 'required|string|max:255',
            'use_season' => 'boolean',
            'season' => 'nullable|required_if:use_season,true|in:summer,winter',
            'year_start' => 'required|integer|min:2020|max:2100',
            'year_end' => 'nullable|integer|min:2020|max:2100|gte:year_start',
            'is_active' => 'boolean',
        ]);

        // Set use_season default if not provided
        $validated['use_season'] = $validated['use_season'] ?? false;

        // Check for duplicate session combination (excluding current session)
        $query = Session::where('year_start', $validated['year_start'])
            ->where('season', $validated['season'] ?? null)
            ->where('use_season', $validated['use_season'])
            ->where('id', '!=', $session->id);
        
        if (isset($validated['year_end'])) {
            $query->where('year_end', $validated['year_end']);
        } else {
            $query->whereNull('year_end');
        }
        
        $exists = $query->exists();

        if ($exists) {
            return back()->withErrors(['session_name' => 'This session configuration already exists.']);
        }

        // If this session is being activated, deactivate others
        if (($validated['is_active'] ?? false) && !$session->is_active) {
            Session::where('is_active', true)
                ->where('id', '!=', $session->id)
                ->update(['is_active' => false]);
        }

        $session->update($validated);

        return redirect()->route('admin.sessions.index')
            ->with('success', 'Session updated successfully.');
    }

    /**
     * Delete session.
     */
    public function destroy(Session $session)
    {
        if ($session->applicants()->count() > 0) {
            return back()->with('error', 'Cannot delete session with applicants.');
        }

        $session->delete();

        return redirect()->route('admin.sessions.index')
            ->with('success', 'Session deleted successfully.');
    }

    /**
     * Set session as active.
     */
    public function setActive(Session $session)
    {
        // Deactivate all sessions
        Session::where('is_active', true)->update(['is_active' => false]);

        // Activate this session
        $session->update(['is_active' => true]);

        return back()->with('success', 'Session activated successfully.');
    }
}
