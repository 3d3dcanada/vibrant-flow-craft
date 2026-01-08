import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { BookOpen, ArrowRight, GraduationCap, Printer, FileText, Box, Wrench, DollarSign, Ruler, PaintBucket, Target, Scale } from 'lucide-react';

interface LearningGuide {
    slug: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    readTime: string;
}

const guides: LearningGuide[] = [
    {
        slug: "3d-printing-basics",
        title: "3D Printing Basics",
        description: "What 3D printing actually is, how it works, and what you can reasonably expect from it — without the hype.",
        icon: <Printer className="w-6 h-6" />,
        readTime: "10 min"
    },
    {
        slug: "licensing-explained",
        title: "Licensing Explained",
        description: "Commercial rights, personal use, Creative Commons — what all the terms mean and why they matter.",
        icon: <FileText className="w-6 h-6" />,
        readTime: "12 min"
    },
    {
        slug: "choosing-your-first-printer",
        title: "Choosing Your First Printer",
        description: "A no-nonsense guide to picking a 3D printer for home use. What actually matters, what's marketing.",
        icon: <GraduationCap className="w-6 h-6" />,
        readTime: "15 min"
    },
    {
        slug: "materials-guide",
        title: "Materials Guide",
        description: "PLA, PETG, ABS, TPU, and beyond. What each material does, when to use it, and what to watch out for.",
        icon: <Box className="w-6 h-6" />,
        readTime: "14 min"
    },
    {
        slug: "post-processing-fundamentals",
        title: "Post-Processing Fundamentals",
        description: "Support removal, sanding, painting, vapor smoothing — turning raw prints into finished pieces.",
        icon: <Wrench className="w-6 h-6" />,
        readTime: "16 min"
    },
    {
        slug: "when-to-print-vs-buy",
        title: "When to Print vs Buy",
        description: "The honest math on when 3D printing makes sense and when you should just order from a store.",
        icon: <Scale className="w-6 h-6" />,
        readTime: "12 min"
    },
    {
        slug: "pricing-prints-fairly",
        title: "How to Price Prints Fairly",
        description: "Understanding costs, valuing time, and setting prices that sustain you without exploiting customers.",
        icon: <DollarSign className="w-6 h-6" />,
        readTime: "14 min"
    },
    {
        slug: "choosing-filaments-responsibly",
        title: "Choosing Filaments Responsibly",
        description: "Environmental impact, recyclability, and making material choices you can feel good about.",
        icon: <PaintBucket className="w-6 h-6" />,
        readTime: "13 min"
    },
    {
        slug: "designing-for-strength",
        title: "Designing for Strength vs Looks",
        description: "Wall thickness, infill patterns, orientation — the structural decisions that determine success.",
        icon: <Target className="w-6 h-6" />,
        readTime: "15 min"
    },
    {
        slug: "understanding-tolerances",
        title: "Understanding Tolerances",
        description: "Why things don't fit, how to account for shrinkage, and designing parts that actually work together.",
        icon: <Ruler className="w-6 h-6" />,
        readTime: "14 min"
    }
];

/**
 * Learn Index Page
 * Evergreen educational content for beginners and curious users.
 */
export default function Learn() {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary mb-6">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-tech text-sm">Learning Guides</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold gradient-text mb-6">
                        Learn to Make
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Foundational knowledge about 3D printing, licensing, materials, and ownership.
                        Written for curious people, not experts. No jargon, no sales pitch.
                    </p>
                </div>

                {/* Philosophy Note */}
                <GlassPanel className="p-6 mb-12">
                    <div className="text-center">
                        <h3 className="font-tech font-bold text-foreground mb-2">Our Educational Philosophy</h3>
                        <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
                            We believe understanding leads to better decisions. These guides aren't about selling you
                            on 3D printing or our service — they're about giving you the knowledge to decide for yourself
                            what suits your needs. We'd rather you make an informed choice than a profitable-for-us mistake.
                        </p>
                    </div>
                </GlassPanel>

                {/* Guides Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {guides.map((guide) => (
                        <Link key={guide.slug} to={`/learn/${guide.slug}`}>
                            <GlassPanel className="p-6 h-full hover:border-secondary/50 transition-colors cursor-pointer">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="p-3 rounded-xl bg-secondary/10 text-secondary flex-shrink-0">
                                            {guide.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h2 className="text-lg font-tech font-bold text-foreground leading-tight">
                                                    {guide.title}
                                                </h2>
                                            </div>
                                            <span className="text-xs text-muted-foreground">{guide.readTime}</span>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                                        {guide.description}
                                    </p>
                                </div>
                            </GlassPanel>
                        </Link>
                    ))}
                </div>

                {/* CTA to Blog */}
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                        Want deeper dives on specific topics?
                    </p>
                    <Link to="/blog">
                        <NeonButton variant="secondary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">
                            Read Our Blog
                        </NeonButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
