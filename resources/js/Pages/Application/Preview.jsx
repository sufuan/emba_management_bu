import PublicLayout from '@/Layouts/PublicLayout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, Download, FileText, Printer, Share2 } from 'lucide-react';

export default function Preview({ applicant }) {
    return (
        <PublicLayout>
            <Head title="Application Submitted - EMBA" />

            <section className="bg-gradient-to-br from-green-600 to-emerald-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Application Submitted Successfully!</h1>
                    <p className="text-green-100">Your application has been received and is being processed</p>
                </div>
            </section>

            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Quick Actions */}
                        <Card className="mb-6 border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <a href={`/application/${applicant.id}/pdf/download`}>
                                        <Button className="gap-2"><Download className="h-4 w-4" /> Download Application</Button>
                                    </a>
                                    <a href={`/application/${applicant.id}/pdf/preview`} target="_blank">
                                        <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" /> Print Preview</Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Application Summary */}
                        <Card className="border-0 shadow-xl overflow-hidden">
                            <CardHeader className="bg-primary text-white">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Application Summary</CardTitle>
                                    <Badge variant="secondary" className="bg-white/20 text-white">Form No: {applicant.form_no}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-6">
                                        {/* Personal Info */}
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3 text-primary">Personal Information</h3>
                                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                                <div><span className="text-muted-foreground">Full Name:</span><p className="font-medium">{applicant.full_name}</p></div>
                                                <div><span className="text-muted-foreground">Father's Name:</span><p className="font-medium">{applicant.fathers_name}</p></div>
                                                <div><span className="text-muted-foreground">Mother's Name:</span><p className="font-medium">{applicant.mothers_name}</p></div>
                                                <div><span className="text-muted-foreground">Date of Birth:</span><p className="font-medium">{applicant.dob}</p></div>
                                                <div><span className="text-muted-foreground">Phone:</span><p className="font-medium">{applicant.phone}</p></div>
                                                <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{applicant.email}</p></div>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Academic Info */}
                                        <div>
                                            <h3 className="font-semibold text-lg mb-3 text-primary">Academic Details</h3>
                                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                                <div><span className="text-muted-foreground">Subject Choice:</span><p className="font-medium">{applicant.subject_choice}</p></div>
                                                <div><span className="text-muted-foreground">Admission Roll:</span><p className="font-medium">{applicant.admission_roll}</p></div>
                                                <div><span className="text-muted-foreground">Session:</span><p className="font-medium">{applicant.session?.session_name}</p></div>
                                                <div><span className="text-muted-foreground">Status:</span><Badge className="capitalize">{applicant.status}</Badge></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Photo */}
                                    <div className="text-center">
                                        {applicant.photo_path && (
                                            <img src={`/storage/${applicant.photo_path}`} alt="Applicant" className="w-32 h-40 object-cover rounded-lg shadow-md mx-auto mb-4 border-4 border-white" />
                                        )}
                                        {applicant.signature_path && (
                                            <div className="mt-4">
                                                <p className="text-xs text-muted-foreground mb-2">Signature</p>
                                                <img src={`/storage/${applicant.signature_path}`} alt="Signature" className="h-12 mx-auto" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {/* Important Notice */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-amber-800 mb-2">Important Information</h4>
                                    <ul className="text-sm text-amber-700 space-y-1">
                                        <li>• Save your Form No: <strong>{applicant.form_no}</strong> for future reference</li>
                                        <li>• Your admit card will be available after verification</li>
                                        <li>• You can track your application status using your form number</li>
                                    </ul>
                                </div>

                                <div className="flex justify-center gap-4 mt-6">
                                    <Link href="/track"><Button variant="outline">Track Application</Button></Link>
                                    <Link href="/"><Button>Back to Home</Button></Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

