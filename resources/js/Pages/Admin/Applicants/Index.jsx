import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, CheckCircle2, Download, FileText, Trash2 } from 'lucide-react';

const statusColors = {
    submitted: 'bg-blue-100 text-blue-700',
    pending: 'bg-amber-100 text-amber-700',
    verified: 'bg-green-100 text-green-700',
};

export default function Index({ applicants, filters, sessions }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [session, setSession] = useState(filters?.session_id || 'all');

    const handleFilter = () => {
        router.get('/admin/applicants', { search, status: status !== 'all' ? status : '', session_id: session !== 'all' ? session : '' }, { preserveState: true });
    };

    const handleStatusChange = (id, newStatus) => {
        router.patch(`/admin/applicants/${id}/status`, { status: newStatus });
    };

    return (
        <AdminLayout>
            <Head title="Manage Applicants" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Applicants</h1>
                        <p className="text-muted-foreground">Manage and verify all applications</p>
                    </div>
                    <a href="/admin/applicants/export">
                        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export PDF</Button>
                    </a>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search by name, form no, phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
                            </div>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="verified">Verified</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={session} onValueChange={setSession}>
                                <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Session" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sessions</SelectItem>
                                    {sessions?.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.session_name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleFilter} className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="text-left py-4 px-4 font-medium">Form No</th>
                                        <th className="text-left py-4 px-4 font-medium">Applicant</th>
                                        <th className="text-left py-4 px-4 font-medium">Contact</th>
                                        <th className="text-left py-4 px-4 font-medium">Subject</th>
                                        <th className="text-left py-4 px-4 font-medium">Status</th>
                                        <th className="text-left py-4 px-4 font-medium">Date</th>
                                        <th className="text-right py-4 px-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicants?.data?.length > 0 ? applicants.data.map((a) => (
                                        <tr key={a.id} className="border-b hover:bg-slate-50">
                                            <td className="py-4 px-4 font-medium">{a.form_no}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    {a.photo_path && <img src={`/storage/${a.photo_path}`} alt="" className="w-10 h-10 rounded-full object-cover" />}
                                                    <div><p className="font-medium">{a.full_name}</p><p className="text-xs text-muted-foreground">Roll: {a.admission_roll}</p></div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4"><p className="text-sm">{a.phone}</p><p className="text-xs text-muted-foreground">{a.email}</p></td>
                                            <td className="py-4 px-4">{a.subject_choice}</td>
                                            <td className="py-4 px-4"><Badge className={statusColors[a.status]}>{a.status}</Badge></td>
                                            <td className="py-4 px-4 text-muted-foreground text-sm">{new Date(a.submitted_at).toLocaleDateString()}</td>
                                            <td className="py-4 px-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Link href={`/admin/applicants/${a.id}`}><DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem></Link>
                                                        <a href={`/application/${a.id}/pdf/download`}><DropdownMenuItem><FileText className="h-4 w-4 mr-2" /> Download PDF</DropdownMenuItem></a>
                                                        {a.status !== 'verified' && <DropdownMenuItem onClick={() => handleStatusChange(a.id, 'verified')}><CheckCircle2 className="h-4 w-4 mr-2" /> Mark Verified</DropdownMenuItem>}
                                                        {a.status !== 'pending' && <DropdownMenuItem onClick={() => handleStatusChange(a.id, 'pending')}>Mark Pending</DropdownMenuItem>}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="7" className="py-12 text-center text-muted-foreground">No applicants found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        {applicants?.links && (
                            <div className="flex justify-center gap-2 p-4 border-t">
                                {applicants.links.map((link, i) => (
                                    <Button key={i} variant={link.active ? 'default' : 'outline'} size="sm" disabled={!link.url} onClick={() => link.url && router.get(link.url)} dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

