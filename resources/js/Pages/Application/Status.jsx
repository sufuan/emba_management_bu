import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Clock, AlertCircle, Download, FileText, CreditCard } from 'lucide-react';

const statusConfig = {
    submitted: { icon: Clock, color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700', label: 'Submitted' },
    pending: { icon: AlertCircle, color: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', label: 'Pending Review' },
    verified: { icon: CheckCircle2, color: 'bg-green-500', badge: 'bg-green-100 text-green-700', label: 'Verified' },
};

export default function Status({ applicant }) {
    const status = statusConfig[applicant.status] || statusConfig.submitted;
    const StatusIcon = status.icon;

    return (
        <PublicLayout>
            <Head title="Application Status" />

            <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <Badge variant="secondary" className="bg-white/20 text-white mb-4">{applicant.form_no}</Badge>
                    <h1 className="text-3xl font-bold mb-2">Application Status</h1>
                    <p className="text-slate-300">{applicant.full_name}</p>
                </div>
            </section>

            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Status Card */}
                        <Card className="mb-6 border-0 shadow-lg overflow-hidden">
                            <div className={`${status.color} p-6 text-white text-center`}>
                                <StatusIcon className="h-12 w-12 mx-auto mb-3" />
                                <h2 className="text-2xl font-bold">{status.label}</h2>
                                {applicant.status === 'verified' && (
                                    <p className="text-white/80 mt-2">Congratulations! Your application has been verified.</p>
                                )}
                            </div>
                            <CardContent className="p-6">
                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-4 justify-center mb-6">
                                    <a href={`/application/${applicant.id}/pdf/download`}>
                                        <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" /> Download Application</Button>
                                    </a>
                                    {applicant.status === 'verified' && (
                                        <a href={`/application/${applicant.id}/admit-card/download`}>
                                            <Button className="gap-2 bg-green-600 hover:bg-green-700"><CreditCard className="h-4 w-4" /> Download Admit Card</Button>
                                        </a>
                                    )}
                                </div>

                                <Separator className="my-6" />

                                {/* Application Details */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-primary">Application Details</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Form No</span><span className="font-medium">{applicant.form_no}</span></div>
                                            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Admission Roll</span><span className="font-medium">{applicant.admission_roll}</span></div>
                                            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Session</span><span className="font-medium">{applicant.session?.session_name}</span></div>
                                            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Subject</span><span className="font-medium">{applicant.subject_choice}</span></div>
                                            <div className="flex justify-between py-2"><span className="text-muted-foreground">Status</span><Badge className={status.badge}>{status.label}</Badge></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-primary">Contact Information</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Name</span><span className="font-medium">{applicant.full_name}</span></div>
                                            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Email</span><span className="font-medium">{applicant.email}</span></div>
                                            <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Phone</span><span className="font-medium">{applicant.phone}</span></div>
                                            <div className="flex justify-between py-2"><span className="text-muted-foreground">Submitted</span><span className="font-medium">{new Date(applicant.submitted_at).toLocaleDateString()}</span></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="mt-8">
                                    <h3 className="font-semibold text-primary mb-4">Application Timeline</h3>
                                    <div className="relative pl-8 space-y-4">
                                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                                        <div className="relative"><div className="absolute -left-5 w-4 h-4 rounded-full bg-green-500"></div><p className="font-medium">Application Submitted</p><p className="text-xs text-muted-foreground">{new Date(applicant.submitted_at).toLocaleString()}</p></div>
                                        <div className="relative"><div className={`absolute -left-5 w-4 h-4 rounded-full ${applicant.status !== 'submitted' ? 'bg-green-500' : 'bg-slate-300'}`}></div><p className={applicant.status !== 'submitted' ? 'font-medium' : 'text-muted-foreground'}>Under Review</p></div>
                                        <div className="relative"><div className={`absolute -left-5 w-4 h-4 rounded-full ${applicant.status === 'verified' ? 'bg-green-500' : 'bg-slate-300'}`}></div><p className={applicant.status === 'verified' ? 'font-medium' : 'text-muted-foreground'}>Verification Complete</p></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="text-center">
                            <Link href="/"><Button variant="outline">Back to Home</Button></Link>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

