import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { Search, Filter, MoreVertical, Eye, Download, FileText, Trash2, UserCheck, Users } from 'lucide-react';

export default function Index({ applicants, filters, sessions }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [session, setSession] = useState(filters?.session_id ? String(filters.session_id) : 'all');
    const [accountType, setAccountType] = useState(filters?.account_type || 'all');

    const handleFilter = () => {
        const params = {};
        if (search) params.search = search;
        if (session !== 'all') params.session_id = session;
        if (accountType !== 'all') params.account_type = accountType;
        router.get('/admin/applicants', params, { preserveState: true });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleFilter();
        }
    };

    const getExportParams = () => {
        const params = {};
        if (search) params.search = search;
        if (session !== 'all') params.session_id = session;
        if (accountType !== 'all') params.account_type = accountType;
        return new URLSearchParams(params).toString();
    };

    return (
        <AdminLayout>
            <Head title="Manage Applicants - EMBA Admin" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Applicants</h1>
                        <p className="text-muted-foreground">Manage and verify all applications</p>
                    </div>
                    <div className="flex gap-2">
                        <a href={`/admin/applicants-export?${getExportParams()}`}>
                            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export PDF</Button>
                        </a>
                        <a href={`/admin/applicants-export-excel?${getExportParams()}`}>
                            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export Excel</Button>
                        </a>
                    </div>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by name, form no, phone..." 
                                    value={search} 
                                    onChange={e => setSearch(e.target.value)} 
                                    onKeyPress={handleKeyPress}
                                    className="pl-10" 
                                />
                            </div>
                            <Select value={session} onValueChange={setSession}>
                                <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Session" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sessions</SelectItem>
                                    {sessions?.map(s => (
                                        <SelectItem key={s.id} value={String(s.id)}>
                                            {s.season && s.session_name ? `${s.season.charAt(0).toUpperCase() + s.season.slice(1)} ${s.session_name}` : s.session_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={accountType} onValueChange={setAccountType}>
                                <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Account Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="registered">Registered</SelectItem>
                                    <SelectItem value="guest">Guest</SelectItem>
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
                                        <th className="text-left py-4 px-4 font-medium">Session</th>
                                        <th className="text-left py-4 px-4 font-medium">Type</th>
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
                                            <td className="py-4 px-4">
                                                <Badge variant="outline">
                                                    {a.session?.season && a.session?.session_name 
                                                        ? `${a.session.season.charAt(0).toUpperCase() + a.session.season.slice(1)} ${a.session.session_name}` 
                                                        : a.session?.session_name || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge className={a.account_type === 'Registered' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200'}>
                                                    {a.account_type === 'Registered' ? (
                                                        <><UserCheck className="h-3 w-3 mr-1" /> Registered</>
                                                    ) : (
                                                        <><Users className="h-3 w-3 mr-1" /> Guest</>
                                                    )}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4 text-muted-foreground text-sm">{new Date(a.submitted_at).toLocaleDateString()}</td>
                                            <td className="py-4 px-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <Link href={`/admin/applicants/${a.id}`}><DropdownMenuItem><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem></Link>
                                                        <a href={`/application/${a.id}/pdf/download`}><DropdownMenuItem><FileText className="h-4 w-4 mr-2" /> Download PDF</DropdownMenuItem></a>
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

