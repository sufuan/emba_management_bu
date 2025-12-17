import PublicLayout from '@/Layouts/PublicLayout';
import { Link, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    GraduationCap, Users, Award, BookOpen, ArrowRight, CheckCircle2,
    Briefcase, Clock, Globe, Star, ChevronRight,
} from 'lucide-react';

const features = [
    { icon: Briefcase, title: 'Executive Focus', desc: 'Designed for working professionals with 2+ years experience' },
    { icon: Clock, title: 'Flexible Schedule', desc: 'Weekend classes that fit your busy professional life' },
    { icon: Globe, title: 'Global Network', desc: 'Connect with industry leaders and alumni worldwide' },
    { icon: Award, title: 'Accredited Program', desc: 'Internationally recognized EMBA degree' },
];

const stats = [
    { value: '500+', label: 'Alumni Network' },
    { value: '15+', label: 'Years of Excellence' },
    { value: '95%', label: 'Employment Rate' },
    { value: '50+', label: 'Industry Partners' },
];

const benefits = [
    'Leadership & Strategic Management',
    'Financial Analysis & Decision Making',
    'Marketing Strategy & Innovation',
    'Human Resource Management',
    'Business Analytics & Technology',
    'Entrepreneurship & Venture Creation',
];

export default function Home({ applyNowEnabled, activeSession, applicantAuth, hasSubmittedApplication, requireApplicantAuth }) {
    return (
        <PublicLayout>
            <Head title="Home - EMBA Admission" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="container mx-auto px-4 py-20 lg:py-32 relative">
                    <div className="text-white space-y-6 text-center max-w-5xl mx-auto">
                        <div className="flex items-center justify-center gap-2">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400"></div>
                            <span className="text-blue-300 font-semibold tracking-wider text-xl uppercase">University of Barishal</span>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400"></div>
                        </div>
                        <div className="space-y-6">
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                Transform Your{' '}
                                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                                    Career
                                </span>
                                <br />
                                <span className="text-4xl lg:text-6xl">with an Executive MBA in</span>
                            </h1>
                            <div className="relative inline-block">
                                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-lg blur-xl"></div>
                                <h2 className="relative text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-100 bg-clip-text text-transparent">
                                    Management Studies
                                </h2>
                            </div>
                        </div>
                        <p className="text-lg lg:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                            Join our prestigious Executive MBA program and unlock your leadership potential.
                            Learn from industry experts and build a powerful professional network.
                        </p>
                        
                        {applyNowEnabled && activeSession && (
                            <div className="flex justify-center">
                                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm py-1.5 px-4">
                                    Admission Open: {activeSession.formatted_name}
                                </Badge>
                            </div>
                        )}
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            {applicantAuth ? (
                                hasSubmittedApplication ? null : (
                                    applyNowEnabled ? (
                                        <Link href={route('applicant.application.create')}>
                                            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/25 gap-2">
                                                Complete Application <ArrowRight className="h-5 w-5" />
                                            </Button>
                                        </Link>
                                    ) : null
                                )
                            ) : (
                                applyNowEnabled ? (
                                    <Link href={requireApplicantAuth ? route('applicant.register') : route('applicant.application.create')}>
                                        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/25 gap-2">
                                            Apply Now <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button size="lg" variant="secondary" disabled>Applications Closed</Button>
                                )
                            )}

                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Program Highlights</h2>
                        <p className="text-muted-foreground">Our EMBA program is designed to fit your lifestyle while delivering world-class education</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <Card key={i} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                                <CardContent className="p-6 text-center">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <feature.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge variant="outline" className="mb-4">Curriculum</Badge>
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6">What You'll Learn</h2>
                        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Our comprehensive curriculum covers all aspects of modern business management,
                            preparing you for leadership roles in any industry.
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 text-left">
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                    <span className="text-sm">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-blue-600">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Take the Next Step?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Start your application today and join a community of ambitious professionals.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {applicantAuth ? (
                            hasSubmittedApplication ? (
                                <Link href={route('applicant.dashboard')}>
                                    <Button size="lg" variant="secondary" className="gap-2">
                                        View Application <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                            ) : (
                                applyNowEnabled ? (
                                    <Link href={route('applicant.application.create')}>
                                        <Button size="lg" variant="secondary" className="gap-2">
                                            Complete Application <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                ) : null
                            )
                        ) : (
                            applyNowEnabled ? (
                                <Link href={route('applicant.register')}>
                                    <Button size="lg" variant="secondary" className="gap-2">
                                        Start Application <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                            ) : (
                                <Button size="lg" variant="secondary" disabled>Applications Closed</Button>
                            )
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

