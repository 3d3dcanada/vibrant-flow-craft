import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { Users, Code, Palette, Megaphone, Shield, Mail, MapPin, Heart } from 'lucide-react';

interface RoleProps {
    title: string;
    equity: string;
    icon: React.ReactNode;
    description: string;
    responsibilities: string[];
}

function RoleCard({ title, equity, icon, description, responsibilities }: RoleProps) {
    return (
        <GlassPanel className="p-6">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-tech font-bold text-foreground">
                            {title}
                        </h3>
                        <span className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                            {equity} equity
                        </span>
                    </div>
                    <p className="text-muted-foreground mb-3">
                        {description}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        {responsibilities.map((r, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="text-primary">-</span>
                                {r}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </GlassPanel>
    );
}

/**
 * Careers Page
 * Honest, builder-focused equity opportunities.
 * Solo-founder narrative, clear expectations, no hype.
 */
export default function Careers() {
    const roles: RoleProps[] = [
        {
            title: "Lead Frontend Engineer",
            equity: "3-5%",
            icon: <Code className="w-6 h-6 text-primary" />,
            description: "Own the React/TypeScript codebase. Build UX that feels honest and premium.",
            responsibilities: [
                "Lead frontend architecture decisions",
                "Implement the quote flow and dashboards",
                "Ensure accessibility and performance",
                "Review and mentor future developers"
            ]
        },
        {
            title: "Backend/DevOps Specialist",
            equity: "3-5%",
            icon: <Shield className="w-6 h-6 text-primary" />,
            description: "Supabase, Edge Functions, RLS, and infrastructure that just works.",
            responsibilities: [
                "Own database schema and migrations",
                "Build and maintain Edge Functions",
                "Set up CI/CD and monitoring",
                "Security hardening and compliance"
            ]
        },
        {
            title: "Maker Network Lead (Fredericton)",
            equity: "2-3%",
            icon: <Users className="w-6 h-6 text-primary" />,
            description: "Recruit, onboard, and support local makers. Be the community heartbeat.",
            responsibilities: [
                "Recruit first 10 makers in Fredericton",
                "Quality assurance and maker support",
                "Build community culture",
                "Represent 3D3D at local events"
            ]
        },
        {
            title: "Growth & Content Lead",
            equity: "2-3%",
            icon: <Megaphone className="w-6 h-6 text-primary" />,
            description: "SEO, educational content, and stories that connect makers to customers.",
            responsibilities: [
                "Content strategy and execution",
                "SEO and organic growth",
                "Maker spotlight stories",
                "Social media presence"
            ]
        },
        {
            title: "QA & Security Engineer",
            equity: "2-3%",
            icon: <Palette className="w-6 h-6 text-primary" />,
            description: "E2E testing, accessibility, and making sure things actually work.",
            responsibilities: [
                "Automated test suite",
                "Accessibility compliance (WCAG)",
                "Security audits",
                "Performance optimization"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-display font-bold gradient-text mb-6">
                        Join 3D3D Canada
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        We're building Canada's most trustworthy 3D printing platform.
                        Solo-founder, infrastructure-first, one year in.
                    </p>
                </div>

                {/* The Story */}
                <GlassPanel className="mb-12 p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-tech font-bold text-foreground">
                            The Honest Story
                        </h2>
                    </div>
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            This isn't a funded startup with a slide deck and infinite runway.
                            It's one person who spent a year learning to build real infrastructure,
                            and who now has real tables, real functions, and real code.
                        </p>
                        <p>
                            I'm looking for people who want to build something meaningful,
                            not chase hype. People who see a gap in how 3D printing serves
                            everyday Canadians and want to help fill it.
                        </p>
                        <p>
                            There's no salary yet. What I'm offering is equity in something real,
                            a front-row seat to building a company from scratch, and the chance
                            to shape what Canadian manufacturing looks like for normal people.
                        </p>
                    </div>
                </GlassPanel>

                {/* Roles */}
                <h2 className="text-2xl font-tech font-bold text-foreground mb-8">
                    Open Roles (Equity-Based)
                </h2>

                <div className="space-y-6 mb-12">
                    {roles.map((role, i) => (
                        <RoleCard key={i} {...role} />
                    ))}
                </div>

                {/* Why Join */}
                <GlassPanel className="mb-12 p-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-6">
                        Why Join
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-tech font-bold text-foreground mb-2">Real Infrastructure</h3>
                            <p className="text-sm text-muted-foreground">
                                This isn't a pitch deck. There's a database with 27 tables,
                                19 deployed migrations, and a working quote engine.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-tech font-bold text-foreground mb-2">Canada-Focused</h3>
                            <p className="text-sm text-muted-foreground">
                                Starting in Fredericton, expanding nationally.
                                Built for Canadian regulations and values.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-tech font-bold text-foreground mb-2">Ground Floor</h3>
                            <p className="text-sm text-muted-foreground">
                                Join before launch. Help shape the product, culture,
                                and future of the company.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-tech font-bold text-foreground mb-2">No Bureaucracy</h3>
                            <p className="text-sm text-muted-foreground">
                                No endless meetings. No permission chains.
                                Build things and ship them.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* How to Apply */}
                <div className="text-center">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-4">
                        How to Apply
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                        Send an email with your GitHub (or portfolio) and one thing
                        you'd fix or improve in this codebase. That's it.
                    </p>
                    <a href="mailto:careers@3d3d.ca">
                        <NeonButton variant="primary">
                            <Mail className="w-4 h-4 mr-2" />
                            careers@3d3d.ca
                        </NeonButton>
                    </a>

                    <div className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Remote-friendly, Canada-based preferred</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
