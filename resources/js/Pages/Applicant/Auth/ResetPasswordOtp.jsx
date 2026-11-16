import { useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, GraduationCap, RefreshCw } from 'lucide-react';

export default function ResetPasswordOtp({ email, status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        otp: '',
        password: '',
        password_confirmation: '',
    });

    const resendForm = useForm({});

    // ---- Six-box PIN entry: type to auto-advance, Backspace goes back ----
    const boxRefs = useRef([]);
    const slots = Array.from({ length: 6 }, (_, i) => data.otp[i] || '');

    const focusBox = (i) => {
        const el = boxRefs.current[i];
        if (el) {
            el.focus();
            el.select();
        }
    };

    const writeSlots = (next) => setData('otp', next.join(''));

    const handleBoxFocus = (i) => {
        // Never leave a gap: send focus to the first empty box instead.
        const firstEmpty = slots.indexOf('');
        if (firstEmpty !== -1 && firstEmpty < i) {
            focusBox(firstEmpty);
        }
    };

    const handleBoxChange = (i, value) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        const next = slots.slice();
        next[i] = digit;
        writeSlots(next);
        if (digit && i < 5) {
            focusBox(i + 1);
        }
    };

    const handleBoxKeyDown = (i, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const next = slots.slice();
            if (next[i]) {
                next[i] = '';
                writeSlots(next);
            } else if (i > 0) {
                next[i - 1] = '';
                writeSlots(next);
                focusBox(i - 1);
            }
        } else if (e.key === 'ArrowLeft' && i > 0) {
            e.preventDefault();
            focusBox(i - 1);
        } else if (e.key === 'ArrowRight' && i < 5) {
            e.preventDefault();
            focusBox(i + 1);
        } else if (e.key === 'Delete') {
            e.preventDefault();
            const next = slots.slice();
            next[i] = '';
            writeSlots(next);
        }
    };

    const handleBoxPaste = (e) => {
        e.preventDefault();
        const text = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
        if (!text) return;
        const next = Array.from({ length: 6 }, (_, i) => text[i] || '');
        writeSlots(next);
        focusBox(Math.min(text.length, 5));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('applicant.password.otp.reset'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const resend = (e) => {
        e.preventDefault();
        resendForm.post(route('applicant.password.otp.resend'), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Enter Reset Code - EMBA Admission" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center h-16 w-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mb-4 shadow-lg">
                            <GraduationCap className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Enter Your Code</h1>
                        <p className="text-slate-600">Set a new password for your account</p>
                    </div>

                    {/* Main Card */}
                    <Card className="border-0 shadow-2xl">
                        <CardHeader className="space-y-1 pb-6">
                            <CardTitle className="text-2xl font-bold text-center">Verify &amp; Reset</CardTitle>
                            <CardDescription className="text-center text-base">
                                We sent a 6-digit code to{' '}
                                <span className="font-semibold text-slate-800">{email}</span>.
                                The code is valid for 10 minutes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm font-medium text-green-800">{status}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                {/* OTP Field — six boxes, auto-advance */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold">
                                        6-Digit Code
                                    </Label>
                                    <div className="flex items-center justify-between gap-2" onPaste={handleBoxPaste}>
                                        {slots.map((digit, i) => (
                                            <Input
                                                key={i}
                                                ref={(el) => (boxRefs.current[i] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleBoxChange(i, e.target.value)}
                                                onKeyDown={(e) => handleBoxKeyDown(i, e)}
                                                onFocus={() => handleBoxFocus(i)}
                                                className="h-12 w-11 text-center text-lg font-bold border-slate-300 focus:border-blue-500 focus:ring-blue-500 px-0"
                                                autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                                autoFocus={i === 0}
                                                aria-label={`Code digit ${i + 1}`}
                                                required
                                            />
                                        ))}
                                    </div>
                                    {errors.otp && (
                                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                            <span className="h-1 w-1 rounded-full bg-red-600"></span>
                                            {errors.otp}
                                        </p>
                                    )}
                                </div>

                                {/* New Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-semibold">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Create a new password"
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                                            <span className="h-1 w-1 rounded-full bg-red-600"></span>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-sm font-semibold">
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Confirm your new password"
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg"
                                >
                                    {processing ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Resetting Password...
                                        </>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </Button>
                            </form>

                            {/* Resend + links */}
                            <div className="mt-6 space-y-3 text-center">
                                <form onSubmit={resend}>
                                    <p className="text-sm text-slate-600">
                                        Didn&apos;t receive the code?{' '}
                                        <button
                                            type="submit"
                                            disabled={resendForm.processing}
                                            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                                        >
                                            <RefreshCw className="h-3 w-3" />
                                            {resendForm.processing ? 'Sending...' : 'Resend Code'}
                                        </button>
                                    </p>
                                    {resendForm.errors.email && (
                                        <p className="text-sm text-red-600 font-medium mt-2">{resendForm.errors.email}</p>
                                    )}
                                </form>
                                <p className="text-sm text-slate-600">
                                    Wrong email?{' '}
                                    <Link
                                        href={route('applicant.password.request')}
                                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Enter a different email →
                                    </Link>
                                </p>
                                <p className="text-sm text-slate-600">
                                    Remembered your password?{' '}
                                    <Link
                                        href={route('applicant.login')}
                                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Sign In →
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
