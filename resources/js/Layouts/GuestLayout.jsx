import { Link } from '@inertiajs/react';
import { GraduationCap, Shield, Award } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-slate-200">
                    <div className="mb-8 text-center">
                        <div className="w-20 h-20 bg-blue-900 rounded-md flex items-center justify-center border-2 border-blue-950 mx-auto mb-4">
                            <GraduationCap className="h-11 w-11 text-white" />
                        </div>
                       
                    </div>

                    <div className="w-full">
                        {children}
                    </div>

                    <div className="mt-8 pt-6 border-t-2 border-slate-300">
                        <p className="text-center text-xs text-slate-600 font-semibold">
                            © 2025 Management Studies| BU. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
