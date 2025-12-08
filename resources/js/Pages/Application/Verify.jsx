import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, User, Calendar, Phone, Mail, GraduationCap, Shield, QrCode } from 'lucide-react';

export default function Verify({ applicant, formNo }) {
    const isValid = !!applicant;

    const statusColors = {
        submitted: 'bg-blue-500',
        pending: 'bg-yellow-500',
        verified: 'bg-green-500',
        rejected: 'bg-red-500',
    };

    return (
        <PublicLayout>
            <Head title={`Verify Application - ${formNo}`} />

            <section className="py-12 min-h-[70vh]">
                <div className="container mx-auto px-4 max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <QrCode className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Application Verification</h1>
                        <p className="text-muted-foreground">Form No: <strong>{formNo}</strong></p>
                    </div>

                    {isValid ? (
                        /* Valid Application */
                        <Card className="border-0 shadow-xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-8 w-8" />
                                    <div>
                                        <CardTitle className="text-xl">Application Verified</CardTitle>
                                        <p className="text-green-100 text-sm">This is a valid application</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {/* Status Badge */}
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <span className="text-sm text-muted-foreground">Application Status</span>
                                    <Badge className={`${statusColors[applicant.status] || 'bg-gray-500'} text-white capitalize`}>
                                        {applicant.status}
                                    </Badge>
                                </div>

                                {/* Applicant Photo */}
                                {applicant.photo_path && (
                                    <div className="flex justify-center">
                                        <img
                                            src={`/storage/${applicant.photo_path}`}
                                            alt="Applicant"
                                            className="w-32 h-40 object-cover rounded-xl border-4 border-white shadow-lg"
                                        />
                                    </div>
                                )}

                                {/* Applicant Details */}
                                <div className="grid gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <User className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Full Name</p>
                                            <p className="font-semibold">{applicant.full_name}</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Form No</p>
                                                <p className="font-semibold">{applicant.form_no}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <GraduationCap className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Admission Roll</p>
                                                <p className="font-semibold">{applicant.admission_roll || 'Not Assigned'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Phone className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Phone</p>
                                                <p className="font-semibold">{applicant.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Mail className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Email</p>
                                                <p className="font-semibold text-sm">{applicant.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Session</p>
                                            <p className="font-semibold">{applicant.session?.session_name || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Notice */}
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                                    <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                    <p className="text-sm text-green-700">
                                        This application has been verified as authentic and is registered in the University of Barishal EMBA Admission System.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        /* Invalid Application */
                        <Card className="border-0 shadow-xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white">
                                <div className="flex items-center gap-3">
                                    <XCircle className="h-8 w-8" />
                                    <div>
                                        <CardTitle className="text-xl">Application Not Found</CardTitle>
                                        <p className="text-red-100 text-sm">This form number does not exist</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 text-center">
                                <div className="py-8">
                                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Invalid Form Number</h3>
                                    <p className="text-muted-foreground mb-4">
                                        The form number <strong>{formNo}</strong> was not found in our system.
                                    </p>
                                    <p className="text-sm text-red-600">
                                        This could be a fraudulent document. Please verify with the University directly.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}

