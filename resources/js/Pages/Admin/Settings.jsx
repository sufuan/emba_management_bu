import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { Power, Calendar, FileText, Image, AlertTriangle, CheckCircle2, Loader2, CreditCard, Banknote, Phone, Building2, Shield, UserCheck, Users, Upload, RefreshCw } from 'lucide-react';

export default function Settings({ applyNowEnabled, sessions, uploadConfig, paymentSettings, requireApplicantAuth, offlineFormInfo }) {
    const [isApplyEnabled, setIsApplyEnabled] = useState(applyNowEnabled);
    const [requireAuth, setRequireAuth] = useState(requireApplicantAuth);
    const [isToggling, setIsToggling] = useState(false);
    const [isTogglingAuth, setIsTogglingAuth] = useState(false);
    const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
    const [paymentSaveError, setPaymentSaveError] = useState(null);
    const [paymentSaveSuccess, setPaymentSaveSuccess] = useState(false);
    const [offlinePdfFile, setOfflinePdfFile] = useState(null);
    const [isUploadingPdf, setIsUploadingPdf] = useState(false);
    const [pdfError, setPdfError] = useState(null);
    const [payment, setPayment] = useState({
        payment_fee: paymentSettings?.payment_fee || 500,
        payment_bkash_number: paymentSettings?.payment_bkash_number || '',
        payment_bkash_enabled: paymentSettings?.payment_bkash_enabled ?? true,
        payment_nagad_number: paymentSettings?.payment_nagad_number || '',
        payment_nagad_enabled: paymentSettings?.payment_nagad_enabled ?? true,
        payment_rocket_number: paymentSettings?.payment_rocket_number || '',
        payment_rocket_enabled: paymentSettings?.payment_rocket_enabled ?? true,
        payment_bank_name: paymentSettings?.payment_bank_name || '',
        payment_bank_account: paymentSettings?.payment_bank_account || '',
        payment_bank_enabled: paymentSettings?.payment_bank_enabled ?? true,
    });

    // Check if at least one payment method will remain enabled
    const canDisablePaymentMethod = (methodToDisable) => {
        const enabledMethods = [
            methodToDisable !== 'bkash' && payment.payment_bkash_enabled,
            methodToDisable !== 'nagad' && payment.payment_nagad_enabled,
            methodToDisable !== 'rocket' && payment.payment_rocket_enabled,
            methodToDisable !== 'bank' && payment.payment_bank_enabled,
        ].filter(Boolean);
        return enabledMethods.length > 0;
    };

    // Handle payment method toggle with validation
    const handlePaymentToggle = (method, checked) => {
        if (!checked && !canDisablePaymentMethod(method)) {
            alert('At least one payment method must remain enabled.');
            return;
        }
        setPayment({...payment, [`payment_${method}_enabled`]: checked});
    };

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

    const toggleApplicantAuth = () => {
        setIsTogglingAuth(true);
        router.post('/admin/settings/toggle-auth', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setRequireAuth(!requireAuth);
                setIsTogglingAuth(false);
            },
            onError: () => setIsTogglingAuth(false),
        });
    };

    const updatePaymentSettings = () => {
        setIsUpdatingPayment(true);
        setPaymentSaveError(null);
        setPaymentSaveSuccess(false);
        router.post('/admin/settings/payment', payment, {
            preserveScroll: true,
            onSuccess: () => {
                setIsUpdatingPayment(false);
                setPaymentSaveSuccess(true);
                setTimeout(() => setPaymentSaveSuccess(false), 4000);
            },
            onError: (errors) => {
                setIsUpdatingPayment(false);
                setPaymentSaveError(errors?.payment || 'An unexpected error occurred. Check server logs.');
            },
        });
    };

    const handlePdfFileChange = (e) => {
        const file = e.target.files[0];
        setPdfError(null);
        if (!file) { setOfflinePdfFile(null); return; }
        if (file.type !== 'application/pdf') {
            setPdfError('Only PDF files are allowed.');
            setOfflinePdfFile(null);
            e.target.value = '';
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setPdfError('File must be under 10 MB.');
            setOfflinePdfFile(null);
            e.target.value = '';
            return;
        }
        setOfflinePdfFile(file);
    };

    const uploadOfflineForm = () => {
        if (!offlinePdfFile) { setPdfError('Please select a PDF file first.'); return; }
        setIsUploadingPdf(true);
        setPdfError(null);
        const formData = new FormData();
        formData.append('offline_form_pdf', offlinePdfFile);
        router.post('/admin/offline-form-upload', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsUploadingPdf(false);
                setOfflinePdfFile(null);
                // Reset file input
                const input = document.getElementById('offline_pdf_input');
                if (input) input.value = '';
            },
            onError: (errors) => {
                setIsUploadingPdf(false);
                setPdfError(errors?.offline_form_pdf || 'Upload failed. Please try again.');
            },
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

                    {/* Applicant Authentication Toggle */}
                    <Card className="border-0 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${requireAuth ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Applicant Authentication</CardTitle>
                                    <CardDescription>Require users to register before applying</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium flex items-center gap-2">
                                        {requireAuth ? (
                                            <><UserCheck className="h-4 w-4 text-blue-600" /> Registered Users Only</>
                                        ) : (
                                            <><Users className="h-4 w-4 text-purple-600" /> Guest Applications Allowed</>
                                        )}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {requireAuth 
                                            ? 'Users must register and login to submit applications' 
                                            : 'Users can apply directly without creating an account'}
                                    </p>
                                </div>
                                <Badge className={requireAuth ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                                    {requireAuth ? 'Required' : 'Optional'}
                                </Badge>
                            </div>
                            <Button 
                                onClick={toggleApplicantAuth} 
                                disabled={isTogglingAuth} 
                                className={`w-full mt-4 ${requireAuth ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {isTogglingAuth ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...</>
                                ) : (
                                    requireAuth ? 'Allow Guest Applications' : 'Require Authentication'
                                )}
                            </Button>
                            {!requireAuth && (
                                <div className="flex items-start gap-2 mt-4 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Guest Mode Active</p>
                                        <p className="text-xs mt-1">
                                            Guest applicants won't have accounts or dashboard access. They can only download admit cards after submission. Email and NID must be unique.
                                        </p>
                                    </div>
                                </div>
                            )}
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
                        <CardContent className="space-y-6">
                            {/* Application Fee */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Banknote className="h-4 w-4" /> Application Fee (BDT)</Label>
                                <Input type="number" value={payment.payment_fee} onChange={e => setPayment({...payment, payment_fee: e.target.value})} placeholder="500" className="max-w-xs" />
                            </div>

                            {/* bKash */}
                            <div className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-base"><Phone className="h-4 w-4" /> bKash</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{payment.payment_bkash_enabled ? 'Enabled' : 'Disabled'}</span>
                                        <Switch 
                                            checked={payment.payment_bkash_enabled} 
                                            onCheckedChange={(checked) => handlePaymentToggle('bkash', checked)}
                                        />
                                    </div>
                                </div>
                                {payment.payment_bkash_enabled && (
                                    <Input value={payment.payment_bkash_number} onChange={e => setPayment({...payment, payment_bkash_number: e.target.value})} placeholder="01XXXXXXXXX" />
                                )}
                            </div>

                            {/* Nagad */}
                            <div className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-base"><Phone className="h-4 w-4" /> Nagad</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{payment.payment_nagad_enabled ? 'Enabled' : 'Disabled'}</span>
                                        <Switch 
                                            checked={payment.payment_nagad_enabled} 
                                            onCheckedChange={(checked) => handlePaymentToggle('nagad', checked)}
                                        />
                                    </div>
                                </div>
                                {payment.payment_nagad_enabled && (
                                    <Input value={payment.payment_nagad_number} onChange={e => setPayment({...payment, payment_nagad_number: e.target.value})} placeholder="01XXXXXXXXX" />
                                )}
                            </div>

                            {/* Rocket */}
                            <div className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-base"><Phone className="h-4 w-4" /> Rocket</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{payment.payment_rocket_enabled ? 'Enabled' : 'Disabled'}</span>
                                        <Switch 
                                            checked={payment.payment_rocket_enabled} 
                                            onCheckedChange={(checked) => handlePaymentToggle('rocket', checked)}
                                        />
                                    </div>
                                </div>
                                {payment.payment_rocket_enabled && (
                                    <Input value={payment.payment_rocket_number} onChange={e => setPayment({...payment, payment_rocket_number: e.target.value})} placeholder="01XXXXXXXXX" />
                                )}
                            </div>

                            {/* Bank Transfer */}
                            <div className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4" /> Bank Transfer</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">{payment.payment_bank_enabled ? 'Enabled' : 'Disabled'}</span>
                                        <Switch 
                                            checked={payment.payment_bank_enabled} 
                                            onCheckedChange={(checked) => handlePaymentToggle('bank', checked)}
                                        />
                                    </div>
                                </div>
                                {payment.payment_bank_enabled && (
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-sm">Bank Name & Branch</Label>
                                            <Input value={payment.payment_bank_name} onChange={e => setPayment({...payment, payment_bank_name: e.target.value})} placeholder="Sonali Bank, University Branch" />
                                        </div>
                                        <div>
                                            <Label className="text-sm">Account Number</Label>
                                            <Input value={payment.payment_bank_account} onChange={e => setPayment({...payment, payment_bank_account: e.target.value})} placeholder="XXXXXXXXXXXXXX" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Warning if no methods enabled */}
                            {!payment.payment_bkash_enabled && !payment.payment_nagad_enabled && !payment.payment_rocket_enabled && !payment.payment_bank_enabled && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">No Payment Methods Enabled!</p>
                                        <p className="text-xs mt-1">At least one payment method must be enabled for applicants to submit applications.</p>
                                    </div>
                                </div>
                            )}

                            {paymentSaveError && (
                                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm border border-red-200">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium">Save Failed</p>
                                        <p className="text-xs mt-1">{paymentSaveError}</p>
                                    </div>
                                </div>
                            )}

                            {paymentSaveSuccess && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 rounded-lg text-sm border border-green-200">
                                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                                    <p className="font-medium">Payment settings saved successfully!</p>
                                </div>
                            )}

                            <Button onClick={updatePaymentSettings} disabled={isUpdatingPayment}>
                                {isUpdatingPayment ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 'Save Payment Settings'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Offline Application Form Upload */}
                    <Card className="border-0 shadow-lg lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle>Offline Application Form</CardTitle>
                                    <CardDescription>Upload a new PDF to replace the downloadable offline form for applicants</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {/* Current file status */}
                            <div className={`flex items-start gap-4 p-4 rounded-xl border ${
                                offlineFormInfo?.exists
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : 'bg-amber-50 border-amber-200'
                            }`}>
                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    offlineFormInfo?.exists ? 'bg-emerald-100' : 'bg-amber-100'
                                }`}>
                                    {offlineFormInfo?.exists
                                        ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        : <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    {offlineFormInfo?.exists ? (
                                        <>
                                            <p className="font-semibold text-emerald-800 text-sm">Dynamic PDF Active</p>
                                            <p className="text-emerald-700 text-xs mt-0.5">
                                                Last uploaded: <strong>{offlineFormInfo.uploaded_at}</strong>
                                                {offlineFormInfo.size_kb && <span className="ml-2 text-emerald-600">({offlineFormInfo.size_kb} KB)</span>}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-semibold text-amber-800 text-sm">Using Backup / Original PDF</p>
                                            <p className="text-amber-700 text-xs mt-0.5">No custom PDF uploaded yet. Applicants will download the original form.</p>
                                        </>
                                    )}
                                </div>
                                <a
                                    href="/offline-form"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline flex-shrink-0"
                                >
                                    Preview ↗
                                </a>
                            </div>

                            {/* Upload area */}
                            <div className="space-y-3">
                                <Label htmlFor="offline_pdf_input" className="flex items-center gap-2 font-medium">
                                    <Upload className="h-4 w-4" /> Upload New PDF
                                </Label>

                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                        offlinePdfFile
                                            ? 'border-indigo-400 bg-indigo-50'
                                            : pdfError
                                            ? 'border-red-400 bg-red-50'
                                            : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'
                                    }`}
                                    onClick={() => document.getElementById('offline_pdf_input').click()}
                                >
                                    <input
                                        id="offline_pdf_input"
                                        type="file"
                                        accept="application/pdf,.pdf"
                                        onChange={handlePdfFileChange}
                                        className="hidden"
                                    />
                                    {offlinePdfFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                <FileText className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-indigo-800 text-sm">{offlinePdfFile.name}</p>
                                                <p className="text-indigo-600 text-xs">{(offlinePdfFile.size / 1024).toFixed(1)} KB — click to change</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="h-12 w-12 mx-auto rounded-full bg-slate-200 flex items-center justify-center">
                                                <Upload className="h-6 w-6 text-slate-500" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">Click to select a PDF</p>
                                            <p className="text-xs text-slate-500">PDF only · Max 10 MB</p>
                                        </div>
                                    )}
                                </div>

                                {pdfError && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                        <p className="text-sm text-red-600">{pdfError}</p>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={uploadOfflineForm}
                                disabled={isUploadingPdf || !offlinePdfFile}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {isUploadingPdf ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
                                ) : (
                                    <><RefreshCw className="h-4 w-4 mr-2" /> Upload & Replace PDF</>
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground">
                                ⓘ The original backup PDF is preserved separately and will be served automatically if the upload is ever unavailable.
                            </p>
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

