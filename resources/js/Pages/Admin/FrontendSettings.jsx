import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { Loader2, Plus, Trash2, Layout, FileText } from 'lucide-react';
import { toast } from 'sonner';

const IconInput = ({ value, onChange }) => {
    const IconComponent = Icons[value?.trim()] || Icons.Check;
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 rounded-md border flex items-center justify-center shrink-0" title="Live Preview">
                    <IconComponent className="h-4 w-4 text-slate-600" />
                </div>
                <Input className="font-mono text-sm" value={value} onChange={onChange} placeholder="e.g. Briefcase" />
                <div className="text-xs text-muted-foreground shrink-0 w-20">PascalCase</div>
            </div>
            <div className="text-[11px] text-muted-foreground">
                Find icons at <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">lucide.dev/icons</a>
            </div>
        </div>
    );
};

export default function FrontendSettings({ homeSettings = {}, aboutSettings = {} }) {
    const [isSaving, setIsSaving] = useState(false);

    // Helper to safely parse and guarantee an array
    const ensureArray = (val, defaultVal) => {
        if (!val) return defaultVal;
        try {
            let parsed = typeof val === 'string' ? JSON.parse(val) : val;
            if (typeof parsed === 'string') parsed = JSON.parse(parsed); // Handle double encoding
            if (Array.isArray(parsed)) return parsed;
            if (typeof parsed === 'object') return Object.values(parsed);
            return defaultVal;
        } catch (e) {
            return defaultVal;
        }
    };

    // Initial state matching existing Home.jsx strings
    const defaultHome = {
        hero_university: homeSettings.hero_university || 'University of Barishal',
        hero_title_1: homeSettings.hero_title_1 || 'Transform Your',
        hero_title_2: homeSettings.hero_title_2 || 'Career',
        hero_title_3: homeSettings.hero_title_3 || 'with an Executive MBA in',
        hero_subtitle: homeSettings.hero_subtitle || 'Management Studies',
        hero_desc: homeSettings.hero_desc || 'Join our prestigious Executive MBA program and unlock your leadership potential. Learn from industry experts and build a powerful professional network.',
        
        features_title: homeSettings.features_title || 'Program Highlights',
        features_desc: homeSettings.features_desc || 'Our EMBA program is designed to fit your lifestyle while delivering world-class education',
        features: ensureArray(homeSettings.features, [
            { icon: 'Briefcase', title: 'Executive Focus', desc: 'Designed for working professionals with 2+ years experience' },
            { icon: 'Clock', title: 'Flexible Schedule', desc: 'Weekend classes that fit your busy professional life' },
            { icon: 'Globe', title: 'Global Network', desc: 'Connect with industry leaders and alumni worldwide' },
            { icon: 'Award', title: 'Accredited Program', desc: 'Internationally recognized EMBA degree' },
        ]),

        curriculum_title: homeSettings.curriculum_title || "What You'll Learn",
        curriculum_desc: homeSettings.curriculum_desc || 'Our comprehensive curriculum covers all aspects of modern business management, preparing you for leadership roles in any industry.',
        curriculum_benefits: ensureArray(homeSettings.curriculum_benefits, [
            'Leadership & Strategic Management',
            'Financial Analysis & Decision Making',
            'Marketing Strategy & Innovation',
            'Human Resource Management',
            'Business Analytics & Technology',
            'Entrepreneurship & Venture Creation',
        ]),

        cta_title: homeSettings.cta_title || 'Ready to Take the Next Step?',
        cta_desc: homeSettings.cta_desc || 'Start your application today and join a community of ambitious professionals.',
    };

    const defaultAbout = {
        hero_title: aboutSettings.hero_title || 'Shaping Future Leaders',
        hero_desc: aboutSettings.hero_desc || 'Learn about our mission, vision, and commitment to excellence in executive education.',
        
        mission_title: aboutSettings.mission_title || 'Our Mission',
        mission_desc: aboutSettings.mission_desc || 'To provide world-class executive education that transforms working professionals into visionary leaders capable of driving organizational success and societal progress. We are committed to delivering innovative curriculum, fostering critical thinking, and building a global network of accomplished business leaders.',
        
        vision_title: aboutSettings.vision_title || 'Our Vision',
        vision_desc: aboutSettings.vision_desc || 'To be recognized as a premier institution for executive management education, known for producing ethical leaders who create sustainable value for businesses and communities worldwide. We envision a future where our graduates lead transformative change across industries and borders.',
        
        values_title: aboutSettings.values_title || 'Core Values',
        values: ensureArray(aboutSettings.values, [
            { icon: 'Target', title: 'Excellence', desc: 'We strive for excellence in education and research.' },
            { icon: 'Eye', title: 'Innovation', desc: 'Embracing new ideas and methodologies in business education.' },
            { icon: 'Users', title: 'Collaboration', desc: 'Building strong partnerships with industry and academia.' },
            { icon: 'Award', title: 'Integrity', desc: 'Maintaining highest ethical standards in all endeavors.' },
        ]),

        history_title: aboutSettings.history_title || '15+ Years of Excellence',
        history_desc: aboutSettings.history_desc || 'Since our establishment, we have been at the forefront of executive education, continuously evolving our programs to meet the changing demands of the global business landscape. Our alumni network spans across 50+ countries, holding leadership positions in Fortune 500 companies and successful startups alike.',
        history_stats: ensureArray(aboutSettings.history_stats, [
            { value: '500+', label: 'Graduates' },
            { value: '50+', label: 'Countries' },
            { value: '95%', label: 'Career Growth' },
        ])
    };

    const [homeState, setHomeState] = useState(defaultHome);
    const [aboutState, setAboutState] = useState(defaultAbout);

    const handleSave = (group, data) => {
        setIsSaving(true);
        router.post('/admin/frontend-settings', { group, settings: data }, {
            preserveScroll: true,
            onSuccess: () => {
                toast("Settings saved successfully");
                setIsSaving(false);
            },
            onError: () => setIsSaving(false)
        });
    };

    return (
        <AdminLayout title="Frontend Settings">
            <Head title="Frontend Settings - Admin" />

            <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="home" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="home" className="flex items-center gap-2"><Layout className="h-4 w-4" /> Home Page</TabsTrigger>
                        <TabsTrigger value="about" className="flex items-center gap-2"><FileText className="h-4 w-4" /> About Page</TabsTrigger>
                    </TabsList>

                    {/* --- HOME PAGE TAB --- */}
                    <TabsContent value="home" className="space-y-6">
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle>Hero Section</CardTitle>
                                <CardDescription>The main banner on the homepage</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <Label>University Name</Label>
                                    <Input value={homeState.hero_university} onChange={e => setHomeState({...homeState, hero_university: e.target.value})} />
                                </div>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div><Label>Title Part 1</Label><Input value={homeState.hero_title_1} onChange={e => setHomeState({...homeState, hero_title_1: e.target.value})} /></div>
                                    <div><Label>Highlighted Word</Label><Input value={homeState.hero_title_2} onChange={e => setHomeState({...homeState, hero_title_2: e.target.value})} /></div>
                                    <div><Label>Title Part 3</Label><Input value={homeState.hero_title_3} onChange={e => setHomeState({...homeState, hero_title_3: e.target.value})} /></div>
                                </div>
                                <div>
                                    <Label>Subtitle (Gradient Text)</Label>
                                    <Input value={homeState.hero_subtitle} onChange={e => setHomeState({...homeState, hero_subtitle: e.target.value})} />
                                </div>
                                <div>
                                    <Label>Hero Description</Label>
                                    <Textarea value={homeState.hero_desc} onChange={e => setHomeState({...homeState, hero_desc: e.target.value})} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle>Features / Highlights</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><Label>Section Title</Label><Input value={homeState.features_title} onChange={e => setHomeState({...homeState, features_title: e.target.value})} /></div>
                                    <div><Label>Section Description</Label><Input value={homeState.features_desc} onChange={e => setHomeState({...homeState, features_desc: e.target.value})} /></div>
                                </div>
                                
                                <div className="space-y-4 mt-4">
                                    {homeState.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50/50">
                                            <div className="flex-1 space-y-2">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div><Label>Icon Name</Label><IconInput value={feature.icon} onChange={e => {
                                                        const newF = [...homeState.features]; newF[idx].icon = e.target.value; setHomeState({...homeState, features: newF});
                                                    }} /></div>
                                                    <div><Label>Title</Label><Input value={feature.title} onChange={e => {
                                                        const newF = [...homeState.features]; newF[idx].title = e.target.value; setHomeState({...homeState, features: newF});
                                                    }} /></div>
                                                </div>
                                                <div><Label>Description</Label><Input value={feature.desc} onChange={e => {
                                                    const newF = [...homeState.features]; newF[idx].desc = e.target.value; setHomeState({...homeState, features: newF});
                                                }} /></div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-red-500 mt-6" onClick={() => {
                                                const newF = [...homeState.features]; newF.splice(idx, 1); setHomeState({...homeState, features: newF});
                                            }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => {
                                        setHomeState({...homeState, features: [...homeState.features, { icon: 'Check', title: 'New Feature', desc: '' }]})
                                    }}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Feature
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle>Curriculum List</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div><Label>Section Title</Label><Input value={homeState.curriculum_title} onChange={e => setHomeState({...homeState, curriculum_title: e.target.value})} /></div>
                                    <div><Label>Section Description</Label><Input value={homeState.curriculum_desc} onChange={e => setHomeState({...homeState, curriculum_desc: e.target.value})} /></div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <Label>Benefits List</Label>
                                    {homeState.curriculum_benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input value={benefit} onChange={e => {
                                                const newB = [...homeState.curriculum_benefits]; newB[idx] = e.target.value; setHomeState({...homeState, curriculum_benefits: newB});
                                            }} />
                                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => {
                                                const newB = [...homeState.curriculum_benefits]; newB.splice(idx, 1); setHomeState({...homeState, curriculum_benefits: newB});
                                            }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full border-dashed mt-2" onClick={() => {
                                        setHomeState({...homeState, curriculum_benefits: [...homeState.curriculum_benefits, 'New Item']})
                                    }}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Item
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle>Call To Action</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div><Label>Title</Label><Input value={homeState.cta_title} onChange={e => setHomeState({...homeState, cta_title: e.target.value})} /></div>
                                <div><Label>Description</Label><Input value={homeState.cta_desc} onChange={e => setHomeState({...homeState, cta_desc: e.target.value})} /></div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end pt-4 pb-12">
                            <Button size="lg" onClick={() => handleSave('home_page', homeState)} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Home Page Settings
                            </Button>
                        </div>
                    </TabsContent>

                    {/* --- ABOUT PAGE TAB --- */}
                    <TabsContent value="about" className="space-y-6">
                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle>About Hero</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div><Label>Title</Label><Input value={aboutState.hero_title} onChange={e => setAboutState({...aboutState, hero_title: e.target.value})} /></div>
                                <div><Label>Description</Label><Textarea value={aboutState.hero_desc} onChange={e => setAboutState({...aboutState, hero_desc: e.target.value})} /></div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle>Mission & Vision</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4 border-b pb-6">
                                    <div><Label>Mission Title</Label><Input value={aboutState.mission_title} onChange={e => setAboutState({...aboutState, mission_title: e.target.value})} /></div>
                                    <div><Label>Mission Description</Label><Textarea value={aboutState.mission_desc} onChange={e => setAboutState({...aboutState, mission_desc: e.target.value})} className="h-24" /></div>
                                </div>
                                <div className="space-y-4">
                                    <div><Label>Vision Title</Label><Input value={aboutState.vision_title} onChange={e => setAboutState({...aboutState, vision_title: e.target.value})} /></div>
                                    <div><Label>Vision Description</Label><Textarea value={aboutState.vision_desc} onChange={e => setAboutState({...aboutState, vision_desc: e.target.value})} className="h-24" /></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle>Core Values</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div><Label>Section Title</Label><Input value={aboutState.values_title} onChange={e => setAboutState({...aboutState, values_title: e.target.value})} /></div>
                                
                                <div className="space-y-4 mt-4">
                                    {aboutState.values.map((val, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg bg-slate-50/50">
                                            <div className="flex-1 space-y-2">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div><Label>Icon Name</Label><IconInput value={val.icon} onChange={e => {
                                                        const newV = [...aboutState.values]; newV[idx].icon = e.target.value; setAboutState({...aboutState, values: newV});
                                                    }} /></div>
                                                    <div><Label>Title</Label><Input value={val.title} onChange={e => {
                                                        const newV = [...aboutState.values]; newV[idx].title = e.target.value; setAboutState({...aboutState, values: newV});
                                                    }} /></div>
                                                </div>
                                                <div><Label>Description</Label><Input value={val.desc} onChange={e => {
                                                    const newV = [...aboutState.values]; newV[idx].desc = e.target.value; setAboutState({...aboutState, values: newV});
                                                }} /></div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-red-500 mt-6" onClick={() => {
                                                const newV = [...aboutState.values]; newV.splice(idx, 1); setAboutState({...aboutState, values: newV});
                                            }}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    ))}
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => {
                                        setAboutState({...aboutState, values: [...aboutState.values, { icon: 'Check', title: 'New Value', desc: '' }]})
                                    }}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Core Value
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-0">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle>History & Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2"><Label>Section Title</Label><Input value={aboutState.history_title} onChange={e => setAboutState({...aboutState, history_title: e.target.value})} /></div>
                                    <div className="md:col-span-2"><Label>Section Description</Label><Textarea value={aboutState.history_desc} onChange={e => setAboutState({...aboutState, history_desc: e.target.value})} /></div>
                                </div>
                                <div className="space-y-4 mt-4 border-t pt-4">
                                    <Label>Statistics Highlights</Label>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {aboutState.history_stats.map((stat, idx) => (
                                            <div key={idx} className="p-4 border rounded-lg space-y-2 bg-slate-50/50 relative pt-8">
                                                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6 text-red-500" onClick={() => {
                                                    const newS = [...aboutState.history_stats]; newS.splice(idx, 1); setAboutState({...aboutState, history_stats: newS});
                                                }}><Trash2 className="h-4 w-4" /></Button>
                                                <div><Label>Value</Label><Input value={stat.value} onChange={e => {
                                                    const newS = [...aboutState.history_stats]; newS[idx].value = e.target.value; setAboutState({...aboutState, history_stats: newS});
                                                }} /></div>
                                                <div><Label>Label</Label><Input value={stat.label} onChange={e => {
                                                    const newS = [...aboutState.history_stats]; newS[idx].label = e.target.value; setAboutState({...aboutState, history_stats: newS});
                                                }} /></div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="outline" className="w-full border-dashed" onClick={() => {
                                        setAboutState({...aboutState, history_stats: [...aboutState.history_stats, { value: '0', label: 'New Stat' }]})
                                    }}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Statistic
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end pt-4 pb-12">
                            <Button size="lg" onClick={() => handleSave('about_page', aboutState)} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save About Page Settings
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
