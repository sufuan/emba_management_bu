import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { User, GraduationCap, Briefcase, Upload, CheckCircle2, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const steps = [
    { id: 1, name: 'Personal Info', icon: User },
    { id: 2, name: 'Education', icon: GraduationCap },
    { id: 3, name: 'Experience', icon: Briefcase },
    { id: 4, name: 'Documents', icon: Upload },
];

export default function Create({ session, subjectChoices, uploadConfig }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [stepErrors, setStepErrors] = useState({});
    const { data, setData, post, processing, errors } = useForm({
        full_name: '', fathers_name: '', mothers_name: '', dob: '', nid: '', phone: '', email: '',
        subject_choice: '', education_json: [{ degree: '', institution: '', year: '', result: '' }],
        experience_json: [{ position: '', company: '', duration: '' }],
        passport_photo: null, signature: null,
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);

    // Validation for each step
    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!data.full_name.trim()) newErrors.full_name = 'Full name is required';
            if (!data.fathers_name.trim()) newErrors.fathers_name = "Father's name is required";
            if (!data.mothers_name.trim()) newErrors.mothers_name = "Mother's name is required";
            if (!data.dob) newErrors.dob = 'Date of birth is required';
            if (!data.nid.trim()) newErrors.nid = 'NID number is required';
            if (!data.phone.trim()) newErrors.phone = 'Phone number is required';
            else if (!/^(\+?880)?[0-9]{10,11}$/.test(data.phone.replace(/\s/g, ''))) newErrors.phone = 'Invalid phone number';
            if (!data.email.trim()) newErrors.email = 'Email is required';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) newErrors.email = 'Invalid email address';
            if (!data.subject_choice) newErrors.subject_choice = 'Subject choice is required';
        }

        if (step === 2) {
            const hasValidEducation = data.education_json.some(edu =>
                edu.degree.trim() && edu.institution.trim() && edu.year.trim() && edu.result.trim()
            );
            if (!hasValidEducation) {
                newErrors.education = 'At least one complete education entry is required';
            }
            data.education_json.forEach((edu, i) => {
                if (edu.degree || edu.institution || edu.year || edu.result) {
                    if (!edu.degree.trim()) newErrors[`edu_${i}_degree`] = 'Degree is required';
                    if (!edu.institution.trim()) newErrors[`edu_${i}_institution`] = 'Institution is required';
                    if (!edu.year.trim()) newErrors[`edu_${i}_year`] = 'Year is required';
                    if (!edu.result.trim()) newErrors[`edu_${i}_result`] = 'Result is required';
                }
            });
        }

        // Step 3 (Experience) is optional - no validation needed

        if (step === 4) {
            if (!data.passport_photo) newErrors.passport_photo = 'Passport photo is required';
            if (!data.signature) newErrors.signature = 'Signature is required';
        }

        setStepErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        // Get constraints based on field
        const constraints = field === 'passport_photo'
            ? { width: 300, height: 300, maxSize: 200 * 1024, label: 'Passport Photo (300×300px)' }
            : { width: 300, height: 80, maxSize: 200 * 1024, label: 'Signature (300×80px)' };

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
                    if (field === 'passport_photo') setPhotoPreview(null);
                    else setSignaturePreview(null);
                } else {
                    // Valid image - set data and preview
                    setData(field, file);
                    if (field === 'passport_photo') setPhotoPreview(ev.target.result);
                    else setSignaturePreview(ev.target.result);
                    setStepErrors(prev => ({ ...prev, [field]: null }));
                }
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    const addEducation = () => setData('education_json', [...data.education_json, { degree: '', institution: '', year: '', result: '' }]);
    const addExperience = () => setData('experience_json', [...data.experience_json, { position: '', company: '', duration: '' }]);

    const updateEducation = (index, field, value) => {
        const updated = [...data.education_json];
        updated[index][field] = value;
        setData('education_json', updated);
        // Clear specific error
        setStepErrors(prev => ({ ...prev, [`edu_${index}_${field}`]: null, education: null }));
    };

    const updateExperience = (index, field, value) => {
        const updated = [...data.experience_json];
        updated[index][field] = value;
        setData('experience_json', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(4)) {
            // Use router.post with FormData for file uploads
            const formData = new FormData();
            formData.append('full_name', data.full_name);
            formData.append('fathers_name', data.fathers_name);
            formData.append('mothers_name', data.mothers_name);
            formData.append('dob', data.dob);
            formData.append('nid', data.nid);
            formData.append('phone', data.phone);
            formData.append('email', data.email);
            formData.append('subject_choice', data.subject_choice);
            formData.append('education_json', JSON.stringify(data.education_json));
            formData.append('experience_json', JSON.stringify(data.experience_json));
            if (data.passport_photo) formData.append('passport_photo', data.passport_photo);
            if (data.signature) formData.append('signature', data.signature);

            router.post('/apply', formData, {
                forceFormData: true,
                onError: (errors) => {
                    console.log('Submission errors:', errors);
                },
            });
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(Math.min(currentStep + 1, 4));
        }
    };
    const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1));

    // Clear field error on input change
    const handleInputChange = (field, value) => {
        setData(field, value);
        setStepErrors(prev => ({ ...prev, [field]: null }));
    };

    return (
        <PublicLayout>
            <Head title="Apply Now" />

            <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">{session.session_name}</Badge>
                    <h1 className="text-3xl font-bold mb-2">Application Form</h1>
                    <p className="text-slate-300">Complete all steps to submit your application</p>
                </div>
            </section>

            <section className="py-12 bg-slate-50">
                <div className="container mx-auto px-4">
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
                                            <Label>NID Number *</Label>
                                            <Input value={data.nid} onChange={e => handleInputChange('nid', e.target.value)} placeholder="National ID" className={stepErrors.nid ? 'border-red-500' : ''} />
                                            {stepErrors.nid && <p className="text-sm text-red-500 mt-1">{stepErrors.nid}</p>}
                                        </div>
                                        <div>
                                            <Label>Phone *</Label>
                                            <Input value={data.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="+880" className={stepErrors.phone ? 'border-red-500' : ''} />
                                            {stepErrors.phone && <p className="text-sm text-red-500 mt-1">{stepErrors.phone}</p>}
                                        </div>
                                        <div>
                                            <Label>Email *</Label>
                                            <Input type="email" value={data.email} onChange={e => handleInputChange('email', e.target.value)} className={stepErrors.email ? 'border-red-500' : ''} />
                                            {stepErrors.email && <p className="text-sm text-red-500 mt-1">{stepErrors.email}</p>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Subject Choice *</Label>
                                            <Select value={data.subject_choice} onValueChange={v => handleInputChange('subject_choice', v)}>
                                                <SelectTrigger className={stepErrors.subject_choice ? 'border-red-500' : ''}><SelectValue placeholder="Select subject" /></SelectTrigger>
                                                <SelectContent>{subjectChoices.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                            </Select>
                                            {stepErrors.subject_choice && <p className="text-sm text-red-500 mt-1">{stepErrors.subject_choice}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Step 2: Education */}
                                {currentStep === 2 && (
                                    <div className="space-y-4">
                                        {stepErrors.education && (
                                            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                                                <AlertCircle className="h-4 w-4" />
                                                <span>{stepErrors.education}</span>
                                            </div>
                                        )}
                                        {data.education_json.map((edu, i) => (
                                            <Card key={i} className="p-4 bg-slate-50">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label>Degree *</Label>
                                                        <Input value={edu.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="e.g., BBA, MBA" className={stepErrors[`edu_${i}_degree`] ? 'border-red-500' : ''} />
                                                        {stepErrors[`edu_${i}_degree`] && <p className="text-sm text-red-500 mt-1">{stepErrors[`edu_${i}_degree`]}</p>}
                                                    </div>
                                                    <div>
                                                        <Label>Institution *</Label>
                                                        <Input value={edu.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} className={stepErrors[`edu_${i}_institution`] ? 'border-red-500' : ''} />
                                                        {stepErrors[`edu_${i}_institution`] && <p className="text-sm text-red-500 mt-1">{stepErrors[`edu_${i}_institution`]}</p>}
                                                    </div>
                                                    <div>
                                                        <Label>Year *</Label>
                                                        <Input value={edu.year} onChange={e => updateEducation(i, 'year', e.target.value)} placeholder="2020" className={stepErrors[`edu_${i}_year`] ? 'border-red-500' : ''} />
                                                        {stepErrors[`edu_${i}_year`] && <p className="text-sm text-red-500 mt-1">{stepErrors[`edu_${i}_year`]}</p>}
                                                    </div>
                                                    <div>
                                                        <Label>Result/CGPA *</Label>
                                                        <Input value={edu.result} onChange={e => updateEducation(i, 'result', e.target.value)} className={stepErrors[`edu_${i}_result`] ? 'border-red-500' : ''} />
                                                        {stepErrors[`edu_${i}_result`] && <p className="text-sm text-red-500 mt-1">{stepErrors[`edu_${i}_result`]}</p>}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                        <Button type="button" variant="outline" onClick={addEducation}>+ Add More Education</Button>
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
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label>Passport Photo * (300×300px, max 200KB)</Label>
                                            <div className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors ${stepErrors.passport_photo ? 'border-red-500' : ''}`}>
                                                {photoPreview ? <img src={photoPreview} alt="Preview" className="w-32 h-32 mx-auto object-cover rounded" /> : <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />}
                                                <Input type="file" accept="image/*" onChange={e => handleFileChange(e, 'passport_photo')} className="mt-2" />
                                            </div>
                                            {(stepErrors.passport_photo || errors.passport_photo) && <p className="text-sm text-red-500">{stepErrors.passport_photo || errors.passport_photo}</p>}
                                        </div>
                                        <div className="space-y-3">
                                            <Label>Signature * (300×80px, max 200KB)</Label>
                                            <div className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors ${stepErrors.signature ? 'border-red-500' : ''}`}>
                                                {signaturePreview ? <img src={signaturePreview} alt="Preview" className="h-16 mx-auto object-contain" /> : <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />}
                                                <Input type="file" accept="image/*" onChange={e => handleFileChange(e, 'signature')} className="mt-2" />
                                            </div>
                                            {(stepErrors.signature || errors.signature) && <p className="text-sm text-red-500">{stepErrors.signature || errors.signature}</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex justify-between pt-6 border-t">
                                    <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 1}><ArrowLeft className="h-4 w-4 mr-2" /> Previous</Button>
                                    {currentStep < 4 ? (
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
                </div>
            </section>
        </PublicLayout>
    );
}

