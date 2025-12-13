import { Head } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, MapPin, IdCard, CheckCircle } from 'lucide-react';

export default function Dashboard({ auth, applicant, session, subjectChoices, uploadConfig, paymentSettings }) {
    return (
        <ApplicantLayout user={auth.user} applicant={applicant}>
            <Head title="Profile - EMBA Admission" />


            {/* Page Header */}
            <div className="border-b bg-white">
                <div className="px-6 py-6">
                    <h1 className="text-2xl font-bold text-slate-900">Profile Information</h1>
                    <p className="text-sm text-slate-600 mt-1">View and manage your personal details</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Account Status */}
                    {applicant && (
                        <Card className="border-l-4 border-l-green-500 bg-green-50">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                        <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-900">Application Submitted</p>
                                        <p className="text-sm text-green-700">Your application has been successfully submitted and is under review</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <User className="h-5 w-5 text-slate-400" />
                                        <span className="font-medium text-slate-900">{auth.user.name}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email Address</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                        <span className="font-medium text-slate-900">{auth.user.email}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <Phone className="h-5 w-5 text-slate-400" />
                                        <span className="font-medium text-slate-900">{auth.user.phone}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Account Status</label>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/* Application Information (if exists) */}
                    {applicant && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IdCard className="h-5 w-5 text-indigo-600" />
                                    Application Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Form Number</label>
                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <IdCard className="h-5 w-5 text-blue-600" />
                                            <span className="font-bold text-blue-700 text-lg">{applicant.form_no}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Session</label>
                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                            <Calendar className="h-5 w-5 text-purple-600" />
                                            <span className="font-bold text-purple-700 text-lg">{applicant.session?.formatted_name || applicant.session?.session_name || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Applicant Address</label>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <MapPin className="h-5 w-5 text-slate-400" />
                                            <span className="font-medium text-slate-900">{applicant.present_address}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Submission Date</label>
                                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                            <Calendar className="h-5 w-5 text-slate-400" />
                                            <span className="font-medium text-slate-900">
                                                {new Date(applicant.created_at).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </ApplicantLayout>
    );
}
