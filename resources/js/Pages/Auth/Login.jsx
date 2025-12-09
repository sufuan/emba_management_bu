import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Lock, Mail, ArrowRight, UserCircle } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login - EMBA Admission Portal" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Administrator Login</h2>
                <p className="text-slate-600 text-sm">Department of Management Studies, University of Barishal</p>
            </div>

            {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">{status}</p>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="text-slate-900 font-bold mb-2 text-sm uppercase tracking-wide" />
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full pl-12 h-12 border-2 border-slate-400 rounded-md focus:border-blue-900 focus:ring-blue-900 bg-white"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="administrator@example.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="text-slate-900 font-bold mb-2 text-sm uppercase tracking-wide" />
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full pl-12 h-12 border-2 border-slate-400 rounded-md focus:border-blue-900 focus:ring-blue-900 bg-white"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center group cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-slate-400 text-blue-900 focus:ring-blue-900"
                        />
                        <span className="ms-2 text-sm text-slate-700 font-semibold">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-semibold text-blue-900 hover:text-blue-950 transition-colors underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full h-12 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider border-2 border-blue-950"
                >
                    {processing ? (
                        <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <ArrowRight className="h-5 w-5" />
                        </>
                    )}
                </button>

               
               
            </form>
        </GuestLayout>
    );
}
