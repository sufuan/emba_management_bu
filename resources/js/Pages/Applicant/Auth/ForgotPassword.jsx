import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, GraduationCap, KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicant.password.email'));
    };

    return (
        <>
            <Head title="Forgot Password - EMBA Admission" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 shadow-lg">
                            <GraduationCap className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password</h1>
                        <p className="text-slate-600">Recover your EMBA applicant account</p>
                    </div>

                    {/* Main Card */}
                    <Card className="border-0 shadow-2xl">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
                            <CardDescription className="text-center text-base">
                                Enter the email address you used when registering.
                                We will send you a 6-digit code to set a new password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm font-medium text-green-800">{status}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-semibold">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="your.email@example.com"
                                            autoComplete="username"
                                            autoFocus
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                            <span className="h-1 w-1 rounded-full bg-red-600"></span>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Sending Code...
                                        </>
                                    ) : (
                                        <>
                                            <KeyRound className="h-4 w-4 mr-2" />
                                            Send Reset Code
                                        </>
                                    )}
                                </Button>
                            </form>

                            {/* Links */}
                            <div className="mt-6 space-y-3 text-center">
                                <p className="text-sm text-slate-600">
                                    Remembered your password?{' '}
                                    <Link
                                        href={route('applicant.login')}
                                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Sign In →
                                    </Link>
                                </p>
                                <p className="text-sm text-slate-600">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href={route('applicant.register')}
                                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Register Now →
                                    </Link>
                                </p>
                                <p>
                                    <Link
                                        href={route('home')}
                                        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                                    >
                                        <ArrowLeft className="h-3 w-3" /> Back to Home
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
