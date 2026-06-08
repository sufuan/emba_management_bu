import PublicLayout from '@/Layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DynamicIcon from '@/components/DynamicIcon';

export default function About({ aboutSettings = {} }) {
    // Helper to guarantee arrays from DB
    const safeArray = (val, fallback) => {
        if (!val) return fallback;
        try {
            let p = typeof val === 'string' ? JSON.parse(val) : val;
            if (typeof p === 'string') p = JSON.parse(p);
            if (Array.isArray(p)) return p;
            if (typeof p === 'object') return Object.values(p);
            return fallback;
        } catch(e) {
            return fallback;
        }
    };

    // Apply fallbacks for settings
    const heroTitle = aboutSettings.hero_title || 'Shaping Future Leaders';
    const heroDesc = aboutSettings.hero_desc || 'Learn about our mission, vision, and commitment to excellence in executive education.';
    
    const missionTitle = aboutSettings.mission_title || 'Our Mission';
    const missionDesc = aboutSettings.mission_desc || 'To provide world-class executive education that transforms working professionals into visionary leaders capable of driving organizational success and societal progress. We are committed to delivering innovative curriculum, fostering critical thinking, and building a global network of accomplished business leaders.';
    
    const visionTitle = aboutSettings.vision_title || 'Our Vision';
    const visionDesc = aboutSettings.vision_desc || 'To be recognized as a premier institution for executive management education, known for producing ethical leaders who create sustainable value for businesses and communities worldwide. We envision a future where our graduates lead transformative change across industries and borders.';
    
    const valuesTitle = aboutSettings.values_title || 'Core Values';
    const values = safeArray(aboutSettings.values, [
        { icon: 'Target', title: 'Excellence', desc: 'We strive for excellence in education and research.' },
        { icon: 'Eye', title: 'Innovation', desc: 'Embracing new ideas and methodologies in business education.' },
        { icon: 'Users', title: 'Collaboration', desc: 'Building strong partnerships with industry and academia.' },
        { icon: 'Award', title: 'Integrity', desc: 'Maintaining highest ethical standards in all endeavors.' },
    ]);

    const historyTitle = aboutSettings.history_title || '15+ Years of Excellence';
    const historyDesc = aboutSettings.history_desc || 'Since our establishment, we have been at the forefront of executive education, continuously evolving our programs to meet the changing demands of the global business landscape. Our alumni network spans across 50+ countries, holding leadership positions in Fortune 500 companies and successful startups alike.';
    const historyStats = safeArray(aboutSettings.history_stats, [
        { value: '500+', label: 'Graduates' },
        { value: '50+', label: 'Countries' },
        { value: '95%', label: 'Career Growth' },
    ]);

    return (
        <PublicLayout>
            <Head title="About Us - EMBA Program" />

            {/* Hero */}
            <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">About EMBA</Badge>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">{heroTitle}</h1>
                    <p className="text-slate-300 max-w-2xl mx-auto">{heroDesc}</p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <Card className="overflow-hidden border-0 shadow-xl">
                            <div className="bg-primary p-6 text-white">
                                <DynamicIcon name="GraduationCap" className="h-10 w-10 mb-4" />
                                <h2 className="text-2xl font-bold">{missionTitle}</h2>
                            </div>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground leading-relaxed">
                                    {missionDesc}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden border-0 shadow-xl">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
                                <DynamicIcon name="Eye" className="h-10 w-10 mb-4" />
                                <h2 className="text-2xl font-bold">{visionTitle}</h2>
                            </div>
                            <CardContent className="p-6">
                                <p className="text-muted-foreground leading-relaxed">
                                    {visionDesc}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4">Our Foundation</Badge>
                        <h2 className="text-3xl font-bold">{valuesTitle}</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <Card key={i} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                                        <DynamicIcon name={value.icon} className="h-7 w-7" />
                                    </div>
                                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                                    <p className="text-sm text-muted-foreground">{value.desc}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* History */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <Badge variant="outline" className="mb-4">Our Journey</Badge>
                        <h2 className="text-3xl font-bold mb-6">{historyTitle}</h2>
                        <p className="text-muted-foreground leading-relaxed mb-8">
                            {historyDesc}
                        </p>
                        <div className="grid grid-cols-3 gap-8">
                            {historyStats.map((stat, i) => (
                                <div key={i}>
                                    <div className="text-4xl font-bold text-primary">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

