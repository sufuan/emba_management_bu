import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, FileSearch, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Track() {
    const { data, setData, post, processing, errors } = useForm({ search: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/track/search');
    };

    return (
        <PublicLayout>
            <Head title="Track Application - EMBA" />

            <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FileSearch className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-4">Track Your Application</h1>
                    <p className="text-slate-300 max-w-xl mx-auto">
                        Enter your Form Number, Phone, or Email to check your application status
                    </p>
                </div>
            </section>

            <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <Card className="max-w-lg mx-auto border-0 shadow-xl">
                        <CardHeader className="text-center">
                            <CardTitle>Search Application</CardTitle>
                            <CardDescription>Enter any of the following to find your application</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Form No / Phone / Email</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            value={data.search}
                                            onChange={e => setData('search', e.target.value)}
                                            placeholder="e.g., EMBA-2025-0001 or +880..."
                                            className="pl-10"
                                        />
                                    </div>
                                    {errors.search && <p className="text-sm text-red-500">{errors.search}</p>}
                                </div>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? 'Searching...' : 'Track Application'}
                                </Button>
                            </form>

                            <div className="mt-8 pt-6 border-t">
                                <h4 className="font-medium mb-4 text-center">Application Status Guide</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <Clock className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">Submitted</Badge>
                                            <p className="text-xs text-muted-foreground mt-1">Application received, awaiting review</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-amber-500" />
                                        <div>
                                            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>
                                            <p className="text-xs text-muted-foreground mt-1">Under review by admission committee</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        <div>
                                            <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Verified</Badge>
                                            <p className="text-xs text-muted-foreground mt-1">Approved! Download your admit card</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}

