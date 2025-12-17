import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { Plus, Calendar, Edit, Trash2, CheckCircle2, Users, Sun, Snowflake } from 'lucide-react';

export default function Index({ sessions, activeSessionId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editSession, setEditSession] = useState(null);

    const currentYear = new Date().getFullYear();
    const { data, setData, post, put, processing, reset, errors } = useForm({
        session_name: `${currentYear}-${(currentYear + 1).toString().slice(-2)}`,
        season: 'winter',
        year_start: currentYear,
        year_end: currentYear + 1,
        is_active: false,
        use_season: false,
    });

    // Auto-update session_name when years or season change
    const handleYearChange = (field, value) => {
        const yearVal = parseInt(value) || currentYear;
        if (field === 'year_start') {
            setData({
                ...data,
                year_start: yearVal,
                year_end: yearVal + 1,
                session_name: `${yearVal}-${(yearVal + 1).toString().slice(-2)}`
            });
        } else {
            setData(field, yearVal);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editSession) {
            put(`/admin/sessions/${editSession.id}`, { onSuccess: () => { setIsOpen(false); reset(); setEditSession(null); } });
        } else {
            post('/admin/sessions', { onSuccess: () => { setIsOpen(false); reset(); } });
        }
    };

    const openEdit = (session) => {
        setEditSession(session);
        setData({ 
            session_name: session.session_name, 
            season: session.season || 'winter',
            year_start: session.year_start, 
            year_end: session.year_end, 
            is_active: session.is_active,
            use_season: session.use_season ?? false
        });
        setIsOpen(true);
    };

    const handleDelete = (id) => {
        router.delete(`/admin/sessions/${id}`);
    };

    const setActive = (id) => {
        router.patch(`/admin/sessions/${id}/activate`);
    };

    return (
        <AdminLayout>
            <Head title="Manage Sessions - EMBA Admin" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Admission Sessions</h1>
                        <p className="text-muted-foreground">Manage admission sessions and cycles</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { reset(); setEditSession(null); } }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2"><Plus className="h-4 w-4" /> New Session</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editSession ? 'Edit Session' : 'Create New Session'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="use-season" className="text-base font-semibold text-slate-800">Use Winter/Summer</Label>
                                        <p className="text-sm text-slate-600">Enable season-based session naming (e.g., Winter 2025-26)</p>
                                    </div>
                                    <Switch 
                                        id="use-season"
                                        checked={data.use_season} 
                                        onCheckedChange={(checked) => setData('use_season', checked)}
                                    />
                                </div>

                                <div>
                                    <Label>Year Start</Label>
                                    <Input type="number" value={data.year_start} onChange={e => handleYearChange('year_start', e.target.value)} min="2020" max="2050" />
                                    {errors.year_start && <p className="text-sm text-red-500 mt-1">{errors.year_start}</p>}
                                </div>

                                {data.use_season && (
                                    <div>
                                        <Label>Season</Label>
                                        <Select value={data.season} onValueChange={(value) => setData('season', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select season" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="winter">
                                                    <div className="flex items-center gap-2">
                                                       
                                                        <span>Winter</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="summer">
                                                    <div className="flex items-center gap-2">
                                                     
                                                        <span>Summer</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.season && <p className="text-sm text-red-500 mt-1">{errors.season}</p>}
                                    </div>
                                )}

                                <div>
                                    <Label>Session Name (Auto-generated)</Label>
                                    <Input value={data.session_name} readOnly className="bg-slate-50 cursor-not-allowed" />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {data.use_season 
                                            ? `Format: ${data.season.charAt(0).toUpperCase() + data.season.slice(1)} YYYY-YY (e.g., Winter 2025-26)`
                                            : 'Format: YYYY-YY (e.g., 2025-26)'}
                                    </p>
                                    {errors.session_name && <p className="text-sm text-red-500 mt-1">{errors.session_name}</p>}
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={processing}>{editSession ? 'Update' : 'Create'} Session</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sessions?.map((session) => (
                        <Card key={session.id} className={`border-0 shadow-lg ${session.id === activeSessionId ? 'ring-2 ring-green-500 bg-green-50' : ''}`}>
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        {session.use_season && session.season && (
                                            session.season === 'summer' ? (
                                                <Sun className={`h-5 w-5 ${session.id === activeSessionId ? 'text-amber-600' : 'text-amber-500'}`} />
                                            ) : (
                                                <Snowflake className={`h-5 w-5 ${session.id === activeSessionId ? 'text-blue-600' : 'text-blue-500'}`} />
                                            )
                                        )}
                                        <CardTitle className={`text-lg ${session.id === activeSessionId ? 'text-green-700' : ''}`}>
                                            {session.use_season && session.season
                                                ? `${session.season.charAt(0).toUpperCase() + session.season.slice(1)} ${session.session_name}`
                                                : session.session_name}
                                        </CardTitle>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {session.id === activeSessionId && <Badge className="bg-green-600 text-white hover:bg-green-700">Active</Badge>}
                                        {session.use_season && session.season && (
                                            <Badge variant={session.season === 'summer' ? 'default' : 'secondary'} className={session.season === 'summer' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}>
                                                {session.season === 'summer' ? 'Summer' : 'Winter'}
                                            </Badge>
                                        )}
                                        <Badge variant="outline" className={session.use_season ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'}>
                                            {session.use_season ? 'Season-Based' : 'Year-Based'}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Academic Year</span>
                                        <span className="font-medium">{session.year_start} - {session.year_end}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Applicants</span>
                                        <span className="font-medium flex items-center gap-1"><Users className="h-4 w-4" /> {session.applicants_count || 0}</span>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        {session.id !== activeSessionId && (
                                            <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setActive(session.id)}>
                                                <CheckCircle2 className="h-4 w-4" /> Set Active
                                            </Button>
                                        )}
                                        <Button size="sm" variant="outline" onClick={() => openEdit(session)}><Edit className="h-4 w-4" /></Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                                                    <AlertDialogDescription>This will permanently delete this session and all associated data. This action cannot be undone.</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(session.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {sessions?.length === 0 && (
                        <Card className="col-span-full border-0 shadow-lg">
                            <CardContent className="py-12 text-center">
                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="font-semibold mb-2">No Sessions Yet</h3>
                                <p className="text-muted-foreground mb-4">Create your first admission session to get started</p>
                                <Button onClick={() => setIsOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Create Session</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

