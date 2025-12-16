import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { User, GraduationCap, Briefcase, Upload, CheckCircle2, ArrowRight, ArrowLeft, Loader2, AlertCircle, Sparkles, CreditCard } from 'lucide-react';

const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Education', icon: GraduationCap },
    { id: 3, name: 'Experience', icon: Briefcase },
    { id: 4, name: 'Documents', icon: Upload },
    { id: 5, name: 'Payment', icon: CreditCard },
];

// Education row definitions
const educationRows = [
    { key: 'ssc', label: 'SSC / Equivalent', required: true },
    { key: 'hsc', label: 'HSC / Equivalent', required: true },
    { key: 'bachelor', label: '4 Years Bachelor', required: true },
    { key: 'master', label: 'Master (if any)', required: false },
];

export default function Create({ session, subjectChoices, uploadConfig, paymentSettings, auth, requireAuth, userEmail }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [stepErrors, setStepErrors] = useState({});
    const { data, setData, post, processing, errors } = useForm({
        full_name: '', fathers_name: '', mothers_name: '', dob: '', nid: '', phone: '', email: userEmail || '',
        present_address: '', permanent_address: '',
        education_json: {
            ssc: { year: '', board: '', subject: '', result: '' },
            hsc: { year: '', board: '', subject: '', result: '' },
            bachelor: { year: '', university: '', department: '', result: '' },
            master: { year: '', university: '', department: '', result: '' },
        },
        experience_json: [{ position: '', company: '', duration: '' }],
        passport_photo: null,
        payment_transaction_id: '', payment_method: '', payment_amount: paymentSettings?.payment_fee || 500,
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    // Validation for each step
    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!data.full_name.trim()) newErrors.full_name = 'Full name is required';
            if (!data.fathers_name.trim()) newErrors.fathers_name = "Father's name is required";
            if (!data.mothers_name.trim()) newErrors.mothers_name = "Mother's name is required";
            if (!data.dob) newErrors.dob = 'Date of birth is required';
            if (!data.nid.trim()) newErrors.nid = 'NID number is required';
            else if (!/^[0-9]+$/.test(data.nid.trim())) newErrors.nid = 'NID must contain only numbers';
            else if (data.nid.trim().length < 10 || data.nid.trim().length > 17) newErrors.nid = 'NID must be 10-17 digits';
            if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
            else if (!/^(\+?880)?[0-9]{10,11}$/.test(data.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid phone number';
            if (!data.email.trim()) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Invalid email address';
            if (!data.present_address.trim()) newErrors.present_address = 'Present address is required';
            if (!data.permanent_address.trim()) newErrors.permanent_address = 'Permanent address is required';
            // Subject is always Management - no validation needed
        }

        if (step === 2) {
            // Validate required education rows (SSC, HSC, Bachelor)
            ['ssc', 'hsc', 'bachelor'].forEach(key => {
                const edu = data.education_json[key];
                const label = key === 'ssc' ? 'SSC' : key === 'hsc' ? 'HSC' : 'Bachelor';
                if (!edu.year.trim()) newErrors[`${key}_year`] = `${label} year is required`;
                if (!edu.board?.trim() && !edu.university?.trim()) newErrors[`${key}_board`] = `${label} board/university is required`;
                if (!edu.subject?.trim() && !edu.department?.trim()) newErrors[`${key}_subject`] = `${label} subject/department is required`;
                if (!edu.result.trim()) newErrors[`${key}_result`] = `${label} result is required`;
            });
        }

        // Step 3 (Experience) is optional - no validation needed

        if (step === 4) {
            if (!data.passport_photo) newErrors.passport_photo = 'Passport photo is required';
        }

        if (step === 5) {
            if (!data.payment_transaction_id.trim()) newErrors.payment_transaction_id = 'Transaction ID is required';
            if (!data.payment_method) newErrors.payment_method = 'Payment method is required';
            if (!data.payment_amount || parseFloat(data.payment_amount) <= 0) newErrors.payment_amount = 'Valid payment amount is required';
        }

        setStepErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        // Constraints for passport photo
        const constraints = { width: 300, height: 300, maxSize: 200 * 1024, label: 'Passport Photo (300×300px)' };

        // Validate file size first
        if (file.size > constraints.maxSize) {
            setStepErrors(prev => ({
                ...prev,
                [field]: `File size must be less than 200KB. Current: ${Math.round(file.size / 1024)}KB`
            }));
            e.target.value = '';
            return;
        }

        // Validate file type
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            setStepErrors(prev => ({
                ...prev,
                [field]: 'Only JPG, JPEG, or PNG images are allowed'
            }));
            e.target.value = '';
            return;
        }

        // Validate image dimensions
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (ev) => {
            img.onload = () => {
                if (img.width !== constraints.width || img.height !== constraints.height) {
                    setStepErrors(prev => ({
                        ...prev,
                        [field]: `Image must be exactly ${constraints.width}×${constraints.height}px. Your image: ${img.width}×${img.height}px`
                    }));
                    e.target.value = '';
                    setData(field, null);
                    setPhotoPreview(null);
                } else {
                    // Valid image - set data and preview
                    setData(field, file);
                    setPhotoPreview(ev.target.result);
                    setStepErrors(prev => ({ ...prev, [field]: null }));
                }
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    const addExperience = () => setData('experience_json', [...data.experience_json, { position: '', company: '', duration: '' }]);

    const updateEducation = (rowKey, field, value) => {
        const updated = { ...data.education_json };
        updated[rowKey] = { ...updated[rowKey], [field]: value };
        setData('education_json', updated);
        // Clear specific error
        setStepErrors(prev => ({ ...prev, [`${rowKey}_${field}`]: null }));
    };

    const updateExperience = (index, field, value) => {
        const updated = [...data.experience_json];
        updated[index][field] = value;
        setData('experience_json', updated);
    };

    // Check if an education row is complete (for live validation indicator)
    const isRowComplete = (key) => {
        const edu = data.education_json[key];
        if (key === 'master') return true; // Optional
        const hasBoard = edu.board?.trim() || edu.university?.trim();
        const hasSubject = edu.subject?.trim() || edu.department?.trim();
        return edu.year?.trim() && hasBoard && hasSubject && edu.result?.trim();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(5)) {
            // Use router.post with FormData for file uploads
            const formData = new FormData();
            formData.append('full_name', data.full_name);
            formData.append('fathers_name', data.fathers_name);
            formData.append('mothers_name', data.mothers_name);
            formData.append('dob', data.dob);
            formData.append('nid', data.nid);
            formData.append('phone', data.phone);
            formData.append('email', data.email);
            formData.append('present_address', data.present_address);
            formData.append('permanent_address', data.permanent_address);
            formData.append('education_json', JSON.stringify(data.education_json));
            formData.append('experience_json', JSON.stringify(data.experience_json));
            formData.append('payment_transaction_id', data.payment_transaction_id);
            formData.append('payment_method', data.payment_method);
            formData.append('payment_amount', data.payment_amount);
            if (data.passport_photo) formData.append('passport_photo', data.passport_photo);

            router.post(route('applicant.application.store'), formData, {
                forceFormData: true,
                onError: (errors) => {
                    console.log('Submission errors:', errors);
                },
            });
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(Math.min(currentStep + 1, 5));
        }
    };
    const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

    // Clear field error on input change
    const handleInputChange = (field, value) => {
        setData(field, value);
        setStepErrors(prev => ({ ...prev, [field]: null }));
    };

    return (
        <>
            <Head title="Apply Now - EMBA Admission" />

            {/* Application Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8 rounded-2xl mb-8 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                <div className="relative text-center px-4">
                    <Badge className="bg-white/20 text-white border-white/30 mb-3">
                        {session?.use_season && session?.season && session?.session_name 
                            ? `${session.season.charAt(0).toUpperCase() + session.season.slice(1)} ${session.session_name}` 
                            : session?.session_name || 'EMBA Admission'}
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">Complete Your Application</h2>
                    <p className="text-blue-100">Applying for {session?.use_season && session?.season && session?.session_name 
                        ? `${session.season.charAt(0).toUpperCase() + session.season.slice(1)} ${session.session_name}` 
                        : session?.session_name || 'EMBA'} Session</p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-3xl mx-auto mb-8">
                        <div className="flex justify-between">
                            {steps.map((step) => (
                                <div key={step.id} className={`flex flex-col items-center ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${currentStep >= step.id ? 'bg-primary text-white' : 'bg-muted'}`}>
                                        {currentStep > step.id ? <CheckCircle2 className="h-6 w-6" /> : <step.icon className="h-6 w-6" />}
                                    </div>
                                    <span className="text-xs font-medium hidden sm:block">{step.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="relative mt-4"><div className="absolute inset-0 h-2 bg-muted rounded-full" /><div className="absolute h-2 bg-primary rounded-full transition-all" style={{ width: `${((currentStep - 1) / 3) * 100}%` }} /></div>
                    </div>

                    <Card className="max-w-3xl mx-auto border-0 shadow-xl">
                        <CardHeader><CardTitle>{steps[currentStep - 1].name}</CardTitle><CardDescription>Step {currentStep} of 4</CardDescription></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Step 1: Personal Info */}
                                {currentStep === 1 && (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <Label>Full Name *</Label>
                                            <Input value={data.full_name} onChange={e => handleInputChange('full_name', e.target.value)} placeholder="Enter your full name" className={stepErrors.full_name ? 'border-red-500' : ''} />
                                            {(stepErrors.full_name || errors.full_name) && <p className="text-sm text-red-500 mt-1">{stepErrors.full_name || errors.full_name}</p>}
                                        </div>
                                        <div>
                                            <Label>Father's Name *</Label>
                                            <Input value={data.fathers_name} onChange={e => handleInputChange('fathers_name', e.target.value)} className={stepErrors.fathers_name ? 'border-red-500' : ''} />
                                            {stepErrors.fathers_name && <p className="text-sm text-red-500 mt-1">{stepErrors.fathers_name}</p>}
                                        </div>
                                        <div>
                                            <Label>Mother's Name *</Label>
                                            <Input value={data.mothers_name} onChange={e => handleInputChange('mothers_name', e.target.value)} className={stepErrors.mothers_name ? 'border-red-500' : ''} />
                                            {stepErrors.mothers_name && <p className="text-sm text-red-500 mt-1">{stepErrors.mothers_name}</p>}
                                        </div>
                                        <div>
                                            <Label>Date of Birth *</Label>
                                            <Input type="date" value={data.dob} onChange={e => handleInputChange('dob', e.target.value)} className={stepErrors.dob ? 'border-red-500' : ''} />
                                            {stepErrors.dob && <p className="text-sm text-red-500 mt-1">{stepErrors.dob}</p>}
                                        </div>
                                        <div>
                                            <Label>NID Number</Label>
                                            <Input
                                                value={data.nid}
                                                onChange={e => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    handleInputChange('nid', value);
                                                }}
                                                placeholder="National ID (10-17 digits)"
                                                className={stepErrors.nid ? 'border-red-500' : ''}
                                                maxLength={17}
                                            />
                                            {stepErrors.nid && <p className="text-sm text-red-500 mt-1">{stepErrors.nid}</p>}
                                        </div>

                                        {/* Contact Details Section */}
                                        <div className="md:col-span-2 mt-4">
                                            <h4 className="font-semibold text-primary mb-3 border-b pb-2">4. Contact Details</h4>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>(a) Present Address *</Label>
                                            <Input value={data.present_address} onChange={e => handleInputChange('present_address', e.target.value)} placeholder="Enter your present address" className={stepErrors.present_address ? 'border-red-500' : ''} />
                                            {stepErrors.present_address && <p className="text-sm text-red-500 mt-1">{stepErrors.present_address}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>(b) Permanent Address *</Label>
                                            <Input value={data.permanent_address} onChange={e => handleInputChange('permanent_address', e.target.value)} placeholder="Enter your permanent address" className={stepErrors.permanent_address ? 'border-red-500' : ''} />
                                            {stepErrors.permanent_address && <p className="text-sm text-red-500 mt-1">{stepErrors.permanent_address}</p>}
                                        </div>
                                        <div>
                                            <Label>(c) Mobile No. *</Label>
                                            <Input value={data.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="+880" className={stepErrors.phone ? 'border-red-500' : ''} />
                                            {stepErrors.phone && <p className="text-sm text-red-500 mt-1">{stepErrors.phone}</p>}
                                        </div>
                                        <div>
                                            <Label>(d) Email *</Label>
                                            <Input 
                                                type="email" 
                                                value={data.email} 
                                                onChange={e => handleInputChange('email', e.target.value)}
                                                readOnly={requireAuth && userEmail} 
                                                className={`${(requireAuth && userEmail) ? 'bg-slate-50 cursor-not-allowed' : ''} ${stepErrors.email ? 'border-red-500' : ''}`}
                                                title={requireAuth && userEmail ? "Email cannot be changed (registered email)" : "Enter your email address"} 
                                                placeholder="your.email@example.com"
                                            />
                                            {requireAuth && userEmail ? (
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                                                    Registered email (cannot be changed)
                                                </p>
                                            ) : (
                                                <p className="text-xs text-slate-500 mt-1">Enter a valid email address</p>
                                            )}
                                            {stepErrors.email && <p className="text-sm text-red-500 mt-1">{stepErrors.email}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Subject</Label>
                                            <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center">
                                                <span className="font-medium">Management</span>
                                                <Badge className="ml-2 bg-primary/10 text-primary border-0">EMBA Program</Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Education */}
                                {currentStep === 2 && (
                                    <div className="space-y-6">
                                        {/* Header with gradient */}
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
                                            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                                            <div className="relative">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Sparkles className="h-5 w-5" />
                                                    <span className="text-sm font-medium uppercase tracking-wider">Education Information</span>
                                                </div>
                                                <p className="text-blue-100 text-sm">Fill out your SSC, HSC, and 4-year Bachelor information. <span className="font-semibold text-white">Master's degree is optional.</span></p>
                                            </div>
                                        </div>

                                        {/* Education Table */}
                                        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-lg bg-white">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-[160px]">Examination</th>
                                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Year of Passing</th>
                                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Board / University</th>
                                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Subject / Dept.</th>
                                                            <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Division / CGPA</th>
                                                            <th className="px-2 py-4 w-[50px]"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {educationRows.map((row, idx) => {
                                                            const edu = data.education_json[row.key];
                                                            const isComplete = isRowComplete(row.key);
                                                            const isMaster = row.key === 'master';
                                                            const boardField = isMaster || row.key === 'bachelor' ? 'university' : 'board';
                                                            const subjectField = isMaster || row.key === 'bachelor' ? 'department' : 'subject';

                                                            return (
                                                                <tr key={row.key} className={`transition-all duration-200 ${isMaster ? 'bg-blue-50/50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50`}>
                                                                    <td className="px-4 py-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-semibold text-slate-700">{row.label}</span>
                                                                            {!row.required && (
                                                                                <Badge variant="secondary" className="text-[10px] bg-blue-100 text-blue-700">Optional</Badge>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        <Input
                                                                            type="number"
                                                                            min="1900"
                                                                            max="2099"
                                                                            value={edu.year}
                                                                            onChange={e => updateEducation(row.key, 'year', e.target.value)}
                                                                            placeholder="e.g. 2020"
                                                                            className={`h-9 text-sm ${stepErrors[`${row.key}_year`] ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 transition-all`}
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        <Input
                                                                            value={edu[boardField] || ''}
                                                                            onChange={e => updateEducation(row.key, boardField, e.target.value)}
                                                                            placeholder={isMaster || row.key === 'bachelor' ? "University name" : "e.g. Dhaka"}
                                                                            className={`h-9 text-sm ${stepErrors[`${row.key}_board`] ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 transition-all`}
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        <Input
                                                                            value={edu[subjectField] || ''}
                                                                            onChange={e => updateEducation(row.key, subjectField, e.target.value)}
                                                                            placeholder={isMaster || row.key === 'bachelor' ? "Department" : "e.g. Science"}
                                                                            className={`h-9 text-sm ${stepErrors[`${row.key}_subject`] ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 transition-all`}
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        <Input
                                                                            value={edu.result}
                                                                            onChange={e => updateEducation(row.key, 'result', e.target.value)}
                                                                            placeholder="e.g. 4.50"
                                                                            className={`h-9 text-sm ${stepErrors[`${row.key}_result`] ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:ring-2 focus:ring-blue-500 transition-all`}
                                                                        />
                                                                    </td>
                                                                    <td className="px-2 py-2 text-center">
                                                                        {isComplete ? (
                                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                                                                                <CheckCircle2 className="h-4 w-4 text-white" />
                                                                            </div>
                                                                        ) : row.required ? (
                                                                            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                                                                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                                                            </div>
                                                                        ) : null}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Validation summary */}
                                        {Object.keys(stepErrors).filter(k => k.startsWith('ssc_') || k.startsWith('hsc_') || k.startsWith('bachelor_')).length > 0 && (
                                            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-sm">Please complete all required fields</p>
                                                    <p className="text-xs text-red-600 mt-1">SSC, HSC, and Bachelor information are required. Look for highlighted fields above.</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Progress indicator */}
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="flex -space-x-1">
                                                    {['ssc', 'hsc', 'bachelor'].map(key => (
                                                        <div key={key} className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${isRowComplete(key) ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'}`}>
                                                            {key === 'ssc' ? 'S' : key === 'hsc' ? 'H' : 'B'}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    {['ssc', 'hsc', 'bachelor'].filter(isRowComplete).length}/3 required sections complete
                                                </span>
                                            </div>
                                            {['ssc', 'hsc', 'bachelor'].every(isRowComplete) && (
                                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                                    <CheckCircle2 className="h-3 w-3 mr-1" /> Ready to proceed
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: Experience (Optional) */}
                                {currentStep === 3 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>Job experience is optional. You can skip this step if not applicable.</span>
                                        </div>
                                        {data.experience_json.map((exp, i) => (
                                            <Card key={i} className="p-4 bg-slate-50">
                                                <div className="grid md:grid-cols-3 gap-4">
                                                    <div><Label>Position</Label><Input value={exp.position} onChange={e => updateExperience(i, 'position', e.target.value)} /></div>
                                                    <div><Label>Company</Label><Input value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} /></div>
                                                    <div><Label>Duration</Label><Input value={exp.duration} onChange={e => updateExperience(i, 'duration', e.target.value)} placeholder="e.g., 2 years" /></div>
                                                </div>
                                            </Card>
                                        ))}
                                        <Button type="button" variant="outline" onClick={addExperience}>+ Add More Experience</Button>
                                    </div>
                                )}

                                {/* Step 4: Documents */}
                                {currentStep === 4 && (
                                    <div className="max-w-md mx-auto">
                                        <div className="space-y-3">
                                            <Label>Passport Photo * (300×300px, max 200KB)</Label>
                                            <div className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors ${stepErrors.passport_photo ? 'border-red-500' : ''}`}>
                                                {photoPreview ? <img src={photoPreview} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded" /> : <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />}
                                                <Input type="file" accept="image/*" onChange={e => handleFileChange(e, 'passport_photo')} className="mt-2" />
                                            </div>
                                            {(stepErrors.passport_photo || errors.passport_photo) && <p className="text-sm text-red-500">{stepErrors.passport_photo || errors.passport_photo}</p>}
                                            <p className="text-xs text-muted-foreground text-center mt-2">Note: Signature will be collected manually during the admission process.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Step 5: Payment */}
                                {currentStep === 5 && (
                                    <div className="space-y-6">
                                        {/* Payment Header */}
                                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white">
                                            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-2xl"></div>
                                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
                                            <div className="relative">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CreditCard className="h-5 w-5" />
                                                    <span className="text-sm font-medium uppercase tracking-wider">Payment Information</span>
                                                </div>
                                                <p className="text-emerald-100 text-sm">Complete your payment via bKash/Nagad/Bank and enter the transaction details below.</p>
                                            </div>
                                        </div>

                                        {/* Payment Instructions */}
                                        <Card className="border-amber-200 bg-amber-50">
                                            <CardContent className="p-4">
                                                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" /> Payment Instructions
                                                </h4>
                                                <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                                                    <li>Application fee: <strong>{paymentSettings?.payment_fee || 500} BDT</strong></li>
                                                    {paymentSettings?.payment_bkash_enabled && paymentSettings?.payment_bkash_number && (
                                                        <li>bKash: <strong>{paymentSettings.payment_bkash_number}</strong></li>
                                                    )}
                                                    {paymentSettings?.payment_nagad_enabled && paymentSettings?.payment_nagad_number && (
                                                        <li>Nagad: <strong>{paymentSettings.payment_nagad_number}</strong></li>
                                                    )}
                                                    {paymentSettings?.payment_rocket_enabled && paymentSettings?.payment_rocket_number && (
                                                        <li>Rocket: <strong>{paymentSettings.payment_rocket_number}</strong></li>
                                                    )}
                                                    {paymentSettings?.payment_bank_enabled && paymentSettings?.payment_bank_name && (
                                                        <li>Bank: <strong>{paymentSettings.payment_bank_name}</strong></li>
                                                    )}
                                                    {paymentSettings?.payment_bank_enabled && paymentSettings?.payment_bank_account && (
                                                        <li>Account: <strong>{paymentSettings.payment_bank_account}</strong></li>
                                                    )}
                                                    <li>Keep your transaction ID/receipt for verification</li>
                                                </ul>
                                            </CardContent>
                                        </Card>

                                        {/* Payment Form */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Payment Method *</Label>
                                                <Select value={data.payment_method} onValueChange={(v) => handleInputChange('payment_method', v)}>
                                                    <SelectTrigger className={stepErrors.payment_method ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Select payment method" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {paymentSettings?.payment_bkash_enabled && (
                                                            <SelectItem value="bKash">bKash</SelectItem>
                                                        )}
                                                        {paymentSettings?.payment_nagad_enabled && (
                                                            <SelectItem value="Nagad">Nagad</SelectItem>
                                                        )}
                                                        {paymentSettings?.payment_rocket_enabled && (
                                                            <SelectItem value="Rocket">Rocket</SelectItem>
                                                        )}
                                                        {paymentSettings?.payment_bank_enabled && (
                                                            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {stepErrors.payment_method && <p className="text-sm text-red-500">{stepErrors.payment_method}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Amount Paid (BDT) *</Label>
                                                <Input
                                                    type="number"
                                                    value={data.payment_amount}
                                                    readOnly
                                                    className="bg-slate-50 cursor-not-allowed"
                                                />
                                                <p className="text-xs text-muted-foreground">Fixed application fee: {paymentSettings?.payment_fee || 500} BDT</p>
                                                {stepErrors.payment_amount && <p className="text-sm text-red-500">{stepErrors.payment_amount}</p>}
                                            </div>

                                            <div className="md:col-span-2 space-y-2">
                                                <Label>Transaction ID / Reference Number *</Label>
                                                <Input
                                                    value={data.payment_transaction_id}
                                                    onChange={e => handleInputChange('payment_transaction_id', e.target.value)}
                                                    placeholder="e.g. TRX123456789 or Receipt No."
                                                    className={stepErrors.payment_transaction_id ? 'border-red-500' : ''}
                                                />
                                                {stepErrors.payment_transaction_id && <p className="text-sm text-red-500">{stepErrors.payment_transaction_id}</p>}
                                                <p className="text-xs text-muted-foreground">Enter the transaction ID from your bKash/Nagad/Bank receipt</p>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        {data.payment_transaction_id && data.payment_method && data.payment_amount && (
                                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                    <span className="font-semibold text-green-700">Payment Details Ready</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div><span className="text-green-600">Method:</span> <strong>{data.payment_method}</strong></div>
                                                    <div><span className="text-green-600">Amount:</span> <strong>{data.payment_amount} BDT</strong></div>
                                                    <div><span className="text-green-600">TRX ID:</span> <strong>{data.payment_transaction_id}</strong></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex justify-between pt-6 border-t">
                                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}><ArrowLeft className="h-4 w-4 mr-2" /> Previous</Button>
                                    {currentStep < 5 ? (
                                        <Button type="button" onClick={nextStep}>Next <ArrowRight className="h-4 w-4 ml-2" /></Button>
                                    ) : (
                                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-primary to-blue-600">
                                            {processing ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</> : <>Submit Application <CheckCircle2 className="h-4 w-4 ml-2" /></>}
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
        </>
    );
}

