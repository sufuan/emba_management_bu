import PublicLayout from '@/Layouts/PublicLayout';
import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle, Clock, Bell, ArrowLeft } from 'lucide-react';

export default function Closed() {
    return (
        <PublicLayout>
            <Head title="Applications Closed - EMBA Admission" />

            <section className="min-h-[70vh] flex items-center justify-center py-20">
                <div className="container mx-auto px-4">
                    <Card className="max-w-lg mx-auto text-center border-0 shadow-xl">
                        <CardContent className="p-8">
                            <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-6">
                                <XCircle className="h-10 w-10" />
                            </div>
                            <h1 className="text-2xl font-bold mb-4">Applications Currently Closed</h1>
                            <p className="text-muted-foreground mb-6">
                                We're not accepting applications at the moment. The next admission cycle
                                will be announced soon. Please check back later or subscribe to our
                                newsletter for updates.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/">
                                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                                        <ArrowLeft className="h-4 w-4" /> Back to Home
                                    </Button>
                                </Link>
                                <Link href="/track">
                                    <Button className="gap-2 w-full sm:w-auto">
                                        <Clock className="h-4 w-4" /> Track Application
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PublicLayout>
    );
}

