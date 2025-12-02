import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
    GraduationCap, LayoutDashboard, Users, Calendar, Settings, LogOut,
    Menu, ChevronRight, Bell, User,
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Applicants', href: '/admin/applicants', icon: Users },
    { name: 'Sessions', href: '/admin/sessions', icon: Calendar },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

function Sidebar({ currentPath }) {
    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-3">
                    <div className="bg-primary rounded-xl p-2.5 shadow-lg shadow-primary/20">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-lg">EMBA Admin</span>
                        <span className="text-xs block text-muted-foreground">Management Portal</span>
                    </div>
                </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                            {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                    <GraduationCap className="h-5 w-5" />
                    View Public Site
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout({ children, title }) {
    const { auth, url } = usePage().props;
    const currentPath = url || window.location.pathname;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col bg-white border-r shadow-sm">
                <Sidebar currentPath={currentPath} />
            </aside>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white/95 backdrop-blur px-4 lg:px-8 shadow-sm">
                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-0">
                            <Sidebar currentPath={currentPath} />
                        </SheetContent>
                    </Sheet>

                    {title && <h1 className="text-lg font-semibold">{title}</h1>}

                    <div className="flex items-center gap-4 ml-auto">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-white">
                                            {auth.user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:block text-sm">{auth.user?.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <div className="flex flex-col">
                                        <span>{auth.user?.name}</span>
                                        <span className="text-xs text-muted-foreground">{auth.user?.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/admin/profile" className="flex items-center gap-2">
                                        <User className="h-4 w-4" /> Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/logout" method="post" as="button" className="flex items-center gap-2 w-full text-red-600">
                                        <LogOut className="h-4 w-4" /> Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-8">{children}</main>
            </div>
        </div>
    );
}

