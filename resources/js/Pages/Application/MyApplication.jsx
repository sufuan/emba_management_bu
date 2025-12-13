import { Head } from '@inertiajs/react';
import ApplicantLayout from '@/Layouts/ApplicantLayout';
import Create from './Create';
import Preview from './Preview';

export default function MyApplication({ auth, applicant, session, subjectChoices, uploadConfig, paymentSettings }) {
    return (
        <ApplicantLayout user={auth.user} applicant={applicant}>
            <Head title={applicant ? 'My Application - EMBA' : 'Apply Now - EMBA'} />
            
            <div className="min-h-screen bg-slate-50">
                {applicant ? (
                    /* Show Preview without PublicLayout wrapper */
                    <div>
                        {/* Page Header */}
                        <div className="border-b bg-white">
                            <div className="px-6 py-6">
                                <h1 className="text-2xl font-bold text-slate-900">My Application</h1>
                                <p className="text-sm text-slate-600 mt-1">View your submitted application details</p>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="p-6">
                            <Preview applicant={applicant} embedded={true} />
                        </div>
                    </div>
                ) : (
                    /* Show Create Form */
                    <div>
                        {/* Page Header */}
                        <div className="border-b bg-white">
                            <div className="px-6 py-6">
                                <h1 className="text-2xl font-bold text-slate-900">Submit Application</h1>
                                <p className="text-sm text-slate-600 mt-1">Complete all required information to submit your EMBA application</p>
                            </div>
                        </div>

                        {/* Create Form */}
                        <div className="p-6">
                            <Create 
                                session={session} 
                                subjectChoices={subjectChoices} 
                                uploadConfig={uploadConfig} 
                                paymentSettings={paymentSettings}
                            />
                        </div>
                    </div>
                )}
            </div>
        </ApplicantLayout>
    );
}
