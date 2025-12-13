import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, GraduationCap, Users, FileCheck, BookOpen } from 'lucide-react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('applicant.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Applicant Login - EMBA Admission" />
            <div className="min-h-screen flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-14 w-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">EMBA Program</h1>
                                <p className="text-slate-300 text-sm">University of Barishal</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                                Your Journey to Excellence Begins Here
                            </h2>
                            <p className="text-lg text-slate-200 leading-relaxed">
                                Welcome back! Sign in to continue your EMBA application process.
                            </p>
                        </div>

                        <div className="space-y-4 pt-8">
                            <div className="flex items-start gap-4 text-white/90">
                                <div className="mt-1 h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <FileCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Track Your Application</h3>
                                    <p className="text-sm text-slate-300">Monitor your admission status in real-time</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 text-white/90">
                                <div className="mt-1 h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Easy Application</h3>
                                    <p className="text-sm text-slate-300">Simple step-by-step application process</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 text-white/90">
                                <div className="mt-1 h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Expert Support</h3>
                                    <p className="text-sm text-slate-300">Get help throughout your journey</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-slate-300 text-sm">
                        <p>© 2025 Department of Management Studies</p>
                        <p className="text-slate-400">University of Barishal</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                    <div className="w-full max-w-md">
                        <div className="mb-8 lg:hidden text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 bg-slate-900 rounded-xl mb-4">
                                <GraduationCap className="h-8 w-8 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">EMBA Program</h1>
                        </div>

                        <Card className="border-0 shadow-2xl">
                            <CardHeader className="space-y-1 pb-6">
                                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
                                <CardDescription className="text-base">
                                    Sign in to your account to continue your application
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
                                        <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="pl-11 h-12 border-slate-300"
                                                placeholder="your.email@example.com"
                                                autoComplete="username"
                                                autoFocus
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-sm text-red-600 font-medium">{errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="pl-11 h-12 border-slate-300"
                                                placeholder="Enter your password"
                                                autoComplete="current-password"
                                            />
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-600 font-medium">{errors.password}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            checked={data.remember}
                                            onCheckedChange={(checked) => setData('remember', checked)}
                                        />
                                        <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-6 space-y-3 text-center">
                                    <p className="text-sm text-slate-600">
                                        Don't have an account?{' '}
                                        <Link
                                            href={route('applicant.register')}
                                            className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
                                        >
                                            Register Now →
                                        </Link>
                                    </p>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-slate-200" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-white px-2 text-slate-500">or</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Administrator?{' '}
                                        <Link
                                            href={route('login')}
                                            className="font-semibold text-blue-900 hover:text-blue-700 transition-colors"
                                        >
                                            Admin Login →
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <p className="text-center text-sm text-slate-500 mt-8">
                            Need help? Contact the admissions office for assistance.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
