import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Power, Calendar, FileText, Image, AlertTriangle, CheckCircle2, Loader2, CreditCard, Banknote, Phone, Building2 } from 'lucide-react';

export default function Settings({ applyNowEnabled, activeSessionId, sessions, uploadConfig, paymentSettings }) {
    const [isApplyEnabled, setIsApplyEnabled] = useState(applyNowEnabled);
    const [selectedSession, setSelectedSession] = useState(String(activeSessionId || ''));
    const [isToggling, setIsToggling] = useState(false);
    const [isUpdatingSession, setIsUpdatingSession] = useState(false);
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
    const [payment, setPayment] = useState({
        payment_fee: paymentSettings?.payment_fee || 500,
        payment_bkash_number: paymentSettings?.payment_bkash_number || '',
        payment_nagad_number: paymentSettings?.payment_nagad_number || '',
        payment_rocket_number: paymentSettings?.payment_rocket_number || '',
        payment_bank_name: paymentSettings?.payment_bank_name || '',
        payment_bank_account: paymentSettings?.payment_bank_account || '',
    });

    const toggleApplyNow = () => {
        setIsToggling(true);
        router.post('/admin/settings/toggle-apply', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsApplyEnabled(!isApplyEnabled);
                setIsToggling(false);
            },
            onError: () => setIsToggling(false),
        });
    };

    const updateActiveSession = () => {
        setIsUpdatingSession(true);
        router.post('/admin/settings/active-session', { session_id: selectedSession }, {
            preserveScroll: true,
            onSuccess: () => setIsUpdatingSession(false),
            onError: () => setIsUpdatingSession(false),
        });
    };

    const updatePaymentSettings = () => {
        setIsUpdatingPayment(true);
        router.post('/admin/settings/payment', payment, {
            preserveScroll: true,
            onSuccess: () => setIsUpdatingPayment(false),
            onError: () => setIsUpdatingPayment(false),
        });
    };

    return (
        <AdminLayout>
            <Head title="Settings - EMBA Admin" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage admission system settings</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Apply Now Toggle */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${isApplyEnabled ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <Power className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Application Portal</CardTitle>
                                    <CardDescription>Control whether applications are open</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium">Apply Now Status</p>
                                    <p className="text-sm text-muted-foreground">
                                        {isApplyEnabled ? 'Applications are currently open' : 'Applications are currently closed'}
                                    </p>
                                </div>
                                <Badge className={isApplyEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                    {isApplyEnabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                            <Button onClick={toggleApplyNow} disabled={isToggling} className={`w-full mt-4 ${isApplyEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
                                {isToggling ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</> : (isApplyEnabled ? 'Disable Applications' : 'Enable Applications')}
                            </Button>
                            {!isApplyEnabled && (
                                <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>Users cannot submit new applications while disabled</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Active Session */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Active Session</CardTitle>
                                    <CardDescription>Set the current admission session</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label>Select Session</Label>
                                    <Select value={selectedSession} onValueChange={setSelectedSession}>
                                        <SelectTrigger><SelectValue placeholder="Choose a session" /></SelectTrigger>
                                        <SelectContent>
                                            {sessions?.map(s => (
                                                <SelectItem key={s.id} value={String(s.id)}>{s.session_name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button onClick={updateActiveSession} className="w-full" disabled={isUpdatingSession || !selectedSession || selectedSession === String(activeSessionId)}>
                                    {isUpdatingSession ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</> : 'Update Active Session'}
                                </Button>
                                {selectedSession && selectedSession === String(activeSessionId) && (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg text-sm">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>This session is currently active</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Settings */}
                    <Card className="border-0 shadow-lg lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Payment Settings</CardTitle>
                                    <CardDescription>Configure application fee and payment methods</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Banknote className="h-4 w-4" /> Application Fee (BDT)</Label>
                                    <Input type="number" value={payment.payment_fee} onChange={e => setPayment({...payment, payment_fee: e.target.value})} placeholder="500" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> bKash Number</Label>
                                    <Input value={payment.payment_bkash_number} onChange={e => setPayment({...payment, payment_bkash_number: e.target.value})} placeholder="01XXXXXXXXX" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Nagad Number</Label>
                                    <Input value={payment.payment_nagad_number} onChange={e => setPayment({...payment, payment_nagad_number: e.target.value})} placeholder="01XXXXXXXXX" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Rocket Number</Label>
                                    <Input value={payment.payment_rocket_number} onChange={e => setPayment({...payment, payment_rocket_number: e.target.value})} placeholder="01XXXXXXXXX" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Bank Name & Branch</Label>
                                    <Input value={payment.payment_bank_name} onChange={e => setPayment({...payment, payment_bank_name: e.target.value})} placeholder="Sonali Bank, University Branch" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Bank Account Number</Label>
                                    <Input value={payment.payment_bank_account} onChange={e => setPayment({...payment, payment_bank_account: e.target.value})} placeholder="XXXXXXXXXXXXXX" />
                                </div>
                            </div>
                            <Button onClick={updatePaymentSettings} className="mt-4" disabled={isUpdatingPayment}>
                                {isUpdatingPayment ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 'Save Payment Settings'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Upload Configuration */}
                    <Card className="border-0 shadow-lg lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                                    <Image className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Upload Configuration</CardTitle>
                                    <CardDescription>Current file upload requirements (configured in .env)</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Passport Photo</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-muted-foreground">Dimensions</span><span>{uploadConfig?.photo_width || 300} × {uploadConfig?.photo_height || 300} px</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Max Size</span><span>{uploadConfig?.photo_max_size || 200} KB</span></div>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <h4 className="font-medium mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Signature</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between"><span className="text-muted-foreground">Dimensions</span><span>{uploadConfig?.signature_width || 300} × {uploadConfig?.signature_height || 80} px</span></div>
                                        <div className="flex justify-between"><span className="text-muted-foreground">Max Size</span><span>{uploadConfig?.signature_max_size || 200} KB</span></div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">* To change upload settings, update the values in your .env file and clear config cache.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

