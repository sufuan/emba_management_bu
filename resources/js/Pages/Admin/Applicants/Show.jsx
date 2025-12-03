import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, CheckCircle2, Clock, AlertCircle, FileText, CreditCard, Printer } from 'lucide-react';

const statusConfig = {
    submitted: { icon: Clock, color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
    pending: { icon: AlertCircle, color: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700' },
    verified: { icon: CheckCircle2, color: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
};

export default function Show({ applicant }) {
    const status = statusConfig[applicant.status];

    const handleStatusChange = (newStatus) => {
        router.patch(`/admin/applicants/${applicant.id}/status`, { status: newStatus });
    };

    return (
        <AdminLayout>
            <Head title={`Applicant: ${applicant.full_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/applicants"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                        <div>
                            <h1 className="text-2xl font-bold">{applicant.full_name}</h1>
                            <p className="text-muted-foreground">{applicant.form_no}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a href={`/application/${applicant.id}/pdf/download`}><Button variant="outline" className="gap-2"><FileText className="h-4 w-4" /> Application PDF</Button></a>
                        {applicant.status === 'verified' && (
                            <a href={`/application/${applicant.id}/admit-card/download`}><Button variant="outline" className="gap-2"><CreditCard className="h-4 w-4" /> Admit Card</Button></a>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><p className="text-sm text-muted-foreground">Full Name</p><p className="font-medium">{applicant.full_name}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Father's Name</p><p className="font-medium">{applicant.fathers_name}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Mother's Name</p><p className="font-medium">{applicant.mothers_name}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Date of Birth</p><p className="font-medium">{applicant.dob}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{applicant.phone}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{applicant.email}</p></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader><CardTitle>Education Background</CardTitle></CardHeader>
                            <CardContent>
                                {applicant.education_json && typeof applicant.education_json === 'object' ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-slate-100">
                                                    <th className="px-4 py-2 text-left font-semibold">Examination</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Year</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Board/University</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Subject/Dept.</th>
                                                    <th className="px-4 py-2 text-left font-semibold">Result/CGPA</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {[
                                                    { key: 'ssc', label: 'SSC / Equivalent' },
                                                    { key: 'hsc', label: 'HSC / Equivalent' },
                                                    { key: 'bachelor', label: '4 Years Bachelor' },
                                                    { key: 'master', label: 'Master (if any)' },
                                                ].map(row => {
                                                    const edu = applicant.education_json[row.key] || {};
                                                    const board = edu.board || edu.university || '';
                                                    const subject = edu.subject || edu.department || '';
                                                    const isEmpty = !edu.year && !board && !subject && !edu.result;
                                                    if (row.key === 'master' && isEmpty) return null;
                                                    return (
                                                        <tr key={row.key} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 font-medium">{row.label}</td>
                                                            <td className="px-4 py-3">{edu.year || '-'}</td>
                                                            <td className="px-4 py-3">{board || '-'}</td>
                                                            <td className="px-4 py-3">{subject || '-'}</td>
                                                            <td className="px-4 py-3">{edu.result || '-'}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="text-muted-foreground">No education data</p>}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardHeader><CardTitle>Work Experience</CardTitle></CardHeader>
                            <CardContent>
                                {applicant.experience_json?.length > 0 ? (
                                    <div className="space-y-4">
                                        {applicant.experience_json.map((exp, i) => (
                                            <div key={i} className="p-4 bg-slate-50 rounded-lg">
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div><p className="text-xs text-muted-foreground">Position</p><p className="font-medium">{exp.position}</p></div>
                                                    <div><p className="text-xs text-muted-foreground">Company</p><p className="font-medium">{exp.company}</p></div>
                                                    <div><p className="text-xs text-muted-foreground">Duration</p><p className="font-medium">{exp.duration}</p></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-muted-foreground">No experience data</p>}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg overflow-hidden">
                            <div className={`${status.color} p-4 text-white text-center`}>
                                <status.icon className="h-8 w-8 mx-auto mb-2" />
                                <p className="font-semibold capitalize">{applicant.status}</p>
                            </div>
                            <CardContent className="p-4 space-y-4">
                                <div className="text-center">
                                    {applicant.photo_path && <img src={`/storage/${applicant.photo_path}`} alt="" className="w-32 h-40 object-cover rounded-lg mx-auto border-4 border-white shadow-lg" />}
                                    {applicant.signature_path && (
                                        <div className="mt-4"><p className="text-xs text-muted-foreground mb-1">Signature</p><img src={`/storage/${applicant.signature_path}`} alt="" className="h-12 mx-auto" /></div>
                                    )}
                                </div>
                                <Separator />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-muted-foreground">Form No</span><span className="font-medium">{applicant.form_no}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Roll</span><span className="font-medium">{applicant.admission_roll}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Subject</span><span className="font-medium">{applicant.subject_choice}</span></div>
                                    <div className="flex justify-between"><span className="text-muted-foreground">Session</span><span className="font-medium">{applicant.session?.session_name}</span></div>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Change Status</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button size="sm" variant={applicant.status === 'submitted' ? 'default' : 'outline'} onClick={() => handleStatusChange('submitted')}>Submitted</Button>
                                        <Button size="sm" variant={applicant.status === 'pending' ? 'default' : 'outline'} onClick={() => handleStatusChange('pending')}>Pending</Button>
                                        <Button size="sm" variant={applicant.status === 'verified' ? 'default' : 'outline'} className={applicant.status === 'verified' ? 'bg-green-600' : ''} onClick={() => handleStatusChange('verified')}>Verified</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

