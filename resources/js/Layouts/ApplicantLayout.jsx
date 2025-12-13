import { Link, router } from '@inertiajs/react';
import { User, FileText, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ApplicantLayout({ user, applicant, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.post(route('applicant.logout'));
    };

    const navigation = [
        { 
            name: 'Profile', 
            href: route('applicant.dashboard'), 
            icon: User,
            current: route().current('applicant.dashboard')
        },
        { 
            name: 'My Application', 
            href: route('applicant.application'),
            icon: FileText,
            current: route().current('applicant.application')
        },
    ];

    const SidebarContent = () => (
        <div className="flex h-full flex-col bg-white">
            {/* Sidebar Header */}
            <div className="flex h-16 items-center gap-3 border-b px-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                    <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">EMBA Portal</p>
                    <p className="text-xs text-slate-500">Applicant Dashboard</p>
                </div>
            </div>

            {/* User Info */}
            <div className="border-b p-6">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                item.current
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200'
                                    : 'text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-t p-4">
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile Header */}
            <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white px-4 lg:hidden">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-slate-900">EMBA Portal</span>
                </div>
            </div>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col border-r bg-white">
                    <SidebarContent />
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:pl-72">
                    {children}
                </main>
            </div>
        </div>
    );
}
