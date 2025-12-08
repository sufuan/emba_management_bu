import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, FileText, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, ArrowRight } from 'lucide-react';

export default function Dashboard({ stats, recentApplicants, activeSession }) {
    const statCards = [
        { title: 'Total Applications', value: stats?.total || 0, icon: FileText, color: 'bg-blue-500', change: '+12%' },
        { title: 'Submitted', value: stats?.submitted || 0, icon: Clock, color: 'bg-slate-500' },
        { title: 'Pending Review', value: stats?.pending || 0, icon: AlertCircle, color: 'bg-amber-500' },
        { title: 'Verified', value: stats?.verified || 0, icon: CheckCircle2, color: 'bg-green-500' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard - EMBA" />

            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Welcome back! Here's an overview of your admission system.</p>
                    </div>
                    {activeSession && (
                        <Badge variant="outline" className="text-sm py-2 px-4">
                            <Calendar className="h-4 w-4 mr-2" />
                            Active Session: {activeSession.session_name}
                        </Badge>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                        {stat.change && (
                                            <p className="text-xs text-green-600 flex items-center mt-1">
                                                <TrendingUp className="h-3 w-3 mr-1" /> {stat.change} this month
                                            </p>
                                        )}
                                    </div>
                                    <div className={`${stat.color} p-3 rounded-xl text-white`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Applications */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Applications</CardTitle>
                            <CardDescription>Latest submitted applications</CardDescription>
                        </div>
                        <Link href="/admin/applicants">
                            <Button variant="outline" size="sm" className="gap-2">
                                View All <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Form No</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentApplicants?.length > 0 ? (
                                        recentApplicants.map((applicant) => (
                                            <tr key={applicant.id} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-4 font-medium">{applicant.form_no}</td>
                                                <td className="py-3 px-4">{applicant.full_name}</td>
                                                <td className="py-3 px-4">{applicant.phone}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={
                                                        applicant.status === 'verified' ? 'bg-green-100 text-green-700' :
                                                        applicant.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }>
                                                        {applicant.status}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-muted-foreground">
                                                    {new Date(applicant.submitted_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-muted-foreground">
                                                No applications yet
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                        <Link href="/admin/applicants">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="bg-blue-100 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Manage Applicants</h3>
                                    <p className="text-sm text-muted-foreground">View and verify applications</p>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                        <Link href="/admin/sessions">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="bg-purple-100 p-3 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Manage Sessions</h3>
                                    <p className="text-sm text-muted-foreground">Create and manage admission sessions</p>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                        <Link href="/admin/settings">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="bg-green-100 p-3 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Settings</h3>
                                    <p className="text-sm text-muted-foreground">Toggle Apply Now & more</p>
                                </div>
                            </CardContent>
                        </Link>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}

