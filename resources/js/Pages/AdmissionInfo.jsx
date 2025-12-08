import PublicLayout from '@/Layouts/PublicLayout';
import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, FileText, Calendar, Clock, CreditCard, ArrowRight, AlertCircle } from 'lucide-react';

const eligibility = [
    'Bachelor\'s degree from a recognized university',
    'Minimum 2 years of professional work experience',
    'Valid National ID (NID)',
    'Proficiency in English communication',
];

const documents = [
    'Recent passport-size photograph (300×300px, max 200KB)',
    'Digital signature (300×80px, max 200KB)',
    'Academic certificates and transcripts',
    'Work experience certificates',
    'National ID card copy',
];

const timeline = [
    { step: 1, title: 'Online Application', desc: 'Fill the online form and upload documents' },
    { step: 2, title: 'Document Verification', desc: 'Our team verifies your submitted documents' },
    { step: 3, title: 'Admit Card', desc: 'Download admit card after verification' },
    { step: 4, title: 'Admission Test', desc: 'Appear for the written examination' },
    { step: 5, title: 'Final Selection', desc: 'Merit-based final selection and enrollment' },
];

export default function AdmissionInfo({ applyNowEnabled, activeSession }) {
    return (
        <PublicLayout>
            <Head title="Admission Information - EMBA" />

            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">Admission {activeSession?.year_start || new Date().getFullYear()}</Badge>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">Admission Guidelines</h1>
                    <p className="text-slate-300 max-w-2xl mx-auto">Everything you need to know about applying to our EMBA program.</p>
                    {applyNowEnabled && activeSession && (
                        <div className="mt-8">
                            <Link href="/apply">
                                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 gap-2">
                                    Start Application <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Important Notice */}
            {!applyNowEnabled && (
                <section className="bg-amber-50 border-b border-amber-200 py-4">
                    <div className="container mx-auto px-4 flex items-center justify-center gap-3 text-amber-800">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Applications are currently closed. Please check back later for the next admission cycle.</span>
                    </div>
                </section>
            )}

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Eligibility */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-primary text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2"><CheckCircle2 /> Eligibility Criteria</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ul className="space-y-3">
                                    {eligibility.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card className="border-0 shadow-lg">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2"><FileText /> Required Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ul className="space-y-3">
                                    {documents.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <FileText className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4">Process</Badge>
                        <h2 className="text-3xl font-bold">Admission Timeline</h2>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block"></div>
                            <div className="space-y-8">
                                {timeline.map((item) => (
                                    <div key={item.step} className="flex gap-6 items-start">
                                        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/30 flex-shrink-0 relative z-10">
                                            {item.step}
                                        </div>
                                        <Card className="flex-1 border-0 shadow-md">
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fee Structure */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <Card className="max-w-2xl mx-auto border-0 shadow-xl overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                            <CardTitle className="flex items-center gap-2 text-xl"><CreditCard /> Fee Structure</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex justify-between py-3 border-b"><span>Application Fee</span><span className="font-semibold">৳ 1,000</span></div>
                                <div className="flex justify-between py-3 border-b"><span>Admission Fee</span><span className="font-semibold">৳ 25,000</span></div>
                                <div className="flex justify-between py-3 border-b"><span>Tuition Fee (per semester)</span><span className="font-semibold">৳ 75,000</span></div>
                                <div className="flex justify-between py-3 text-lg"><span className="font-semibold">Total Program Fee</span><span className="font-bold text-primary">৳ 3,50,000</span></div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-4">* Fees are subject to change. Installment options available.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}

