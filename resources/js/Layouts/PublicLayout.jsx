import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function PublicLayout({ children }) {
    const { auth, applyNowEnabled } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Admission Info', href: '/admission-info' },
        { name: 'Track Application', href: '/track' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Top Bar */}
            <div className="bg-primary text-primary-foreground py-2">
                <div className="container mx-auto px-4 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +880 1234-567890</span>
                        <span className="hidden sm:flex items-center gap-1"><Mail className="h-3 w-3" /> admission@EMBA.edu</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {auth?.user && (
                            <Link href="/admin" className="hover:underline">Dashboard</Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b shadow-sm">
                <nav className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-primary rounded-lg p-2">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-bold text-xl text-primary">EMBA</span>
                                <span className="text-xs block text-muted-foreground">Executive EMBA Program</span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <div className="hidden md:flex items-center gap-4">
                            {applyNowEnabled ? (
                                <Link href="/apply">
                                    <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg">
                                        Apply Now
                                    </Button>
                                </Link>
                            ) : (
                                <Button variant="secondary" disabled>Applications Closed</Button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4">
                                {applyNowEnabled ? (
                                    <Link href="/apply" className="block">
                                        <Button className="w-full">Apply Now</Button>
                                    </Link>
                                ) : (
                                    <Button variant="secondary" disabled className="w-full">Applications Closed</Button>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300">
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-primary rounded-lg p-2">
                                    <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-bold text-xl text-white">EMBA Program</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">
                                Elevate your career with our Executive EMBA program designed for working professionals
                                who aspire to leadership positions.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="hover:text-white transition-colors">{item.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> University Campus, Dhaka</li>
                                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +880 1234-567890</li>
                                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> admission@EMBA.edu</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
                        <p>© {new Date().getFullYear()} EMBA Admission Portal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

