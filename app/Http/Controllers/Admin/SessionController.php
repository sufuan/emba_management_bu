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

        return Inertia::render('Admin/Sessions/Index', [
            'sessions' => $sessions,
            'activeSessionId' => config('admission.active_session_id'),
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
            'year_start' => 'required|integer|min:2020|max:2100',
            'year_end' => 'required|integer|min:2020|max:2100|gte:year_start',
            'is_active' => 'boolean',
        ]);

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
            'year_start' => 'required|integer|min:2020|max:2100',
            'year_end' => 'required|integer|min:2020|max:2100|gte:year_start',
            'is_active' => 'boolean',
        ]);

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
