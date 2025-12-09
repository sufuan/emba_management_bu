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

export default function Home({ applyNowEnabled, activeSession }) {
    return (
        <PublicLayout>
            <Head title="Home - EMBA Admission" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="container mx-auto px-4 py-24 lg:py-32 relative">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white space-y-8">
                            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-sm py-1 px-3">
                                {activeSession ? `Admissions Open: ${activeSession.session_name}` : 'Executive EMBA Program'}
                            </Badge>
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                                Transform Your
                                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Career </span>
                                with EMBA
                            </h1>
                            <p className="text-lg text-slate-300 max-w-xl">
                                Join our prestigious Executive EMBA program and unlock your leadership potential.
                                Learn from industry experts and build a powerful professional network.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {applyNowEnabled ? (
                                    <Link href="/apply">
                                        <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/25 gap-2">
                                            Apply Now <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button size="lg" variant="secondary" disabled>Applications Closed</Button>
                                )}
                                <Link href="/admission-info">
                                    <Button size="lg" variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-900 gap-2">
                                        Learn More <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-30"></div>
                                <Card className="relative bg-white/10 backdrop-blur border-white/20 p-8 rounded-3xl">
                                    <div className="grid grid-cols-2 gap-6">
                                        {stats.map((stat, i) => (
                                            <div key={i} className="text-center p-4">
                                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                                                <div className="text-sm text-slate-300">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
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
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Badge variant="outline" className="mb-4">Curriculum</Badge>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-6">What You'll Learn</h2>
                            <p className="text-muted-foreground mb-8">
                                Our comprehensive curriculum covers all aspects of modern business management,
                                preparing you for leadership roles in any industry.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {benefits.map((benefit, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                        <span className="text-sm">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-6 bg-primary text-white"><BookOpen className="h-8 w-8 mb-3" /><div className="text-2xl font-bold">48</div><div className="text-sm opacity-80">Credit Hours</div></Card>
                            <Card className="p-6"><Users className="h-8 w-8 mb-3 text-primary" /><div className="text-2xl font-bold">25</div><div className="text-sm text-muted-foreground">Expert Faculty</div></Card>
                            <Card className="p-6"><Star className="h-8 w-8 mb-3 text-yellow-500" /><div className="text-2xl font-bold">4.8</div><div className="text-sm text-muted-foreground">Student Rating</div></Card>
                            <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 text-white"><Award className="h-8 w-8 mb-3" /><div className="text-2xl font-bold">Top 10</div><div className="text-sm opacity-80">EMBA Programs</div></Card>
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
                        {applyNowEnabled ? (
                            <Link href="/apply"><Button size="lg" variant="secondary" className="gap-2">Start Application <ArrowRight className="h-5 w-5" /></Button></Link>
                        ) : (
                            <Button size="lg" variant="secondary" disabled>Applications Closed</Button>
                        )}
                      
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

