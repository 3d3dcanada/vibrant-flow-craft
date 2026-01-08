import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Calendar, ArrowRight, User, BookOpen } from 'lucide-react';

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
}

const posts: BlogPost[] = [
    {
        slug: "printing-isnt-piracy",
        title: "Printing Isn't Piracy: How to Respect Designers and Still Make Things",
        excerpt: "How to know if you have the right to print a file, what to do when you're unsure, and why respecting creators keeps the community healthy.",
        date: "2026-01-08",
        author: "Founder",
        category: "Education"
    },
    {
        slug: "what-youre-paying-for-renting-printer",
        title: "What You're Really Paying For When You 'Rent' a 3D Printer",
        excerpt: "A print service isn't just plastic and electricity. It's expertise, equipment, quality control, and convenience that would cost you far more on your own.",
        date: "2026-01-08",
        author: "Founder",
        category: "Education"
    },
    {
        slug: "why-we-dont-want-you-dependent",
        title: "Why We Don't Want You Dependent on 3D3D Forever",
        excerpt: "We want you to outgrow us. Here's why a print service genuinely wants you to eventually buy your own printer.",
        date: "2026-01-08",
        author: "Founder",
        category: "Philosophy"
    },
    {
        slug: "stl-to-object",
        title: "From STL to Object: How Digital Things Become Physical",
        excerpt: "Understanding the journey from file to finished print helps you make better decisions about what you're printing and why.",
        date: "2026-01-08",
        author: "Founder",
        category: "Education"
    },
    {
        slug: "commercial-vs-personal-licenses",
        title: "Commercial vs Personal Licenses: What They Actually Mean",
        excerpt: "You download a file. Can you sell prints? The answer depends on the license — and most people have no idea what that means.",
        date: "2026-01-08",
        author: "Founder",
        category: "Education"
    },
    {
        slug: "how-designers-make-money",
        title: "How 3D Designers Make Money (And Why Many Don't)",
        excerpt: "Behind every cool 3D model is someone who spent hours designing it. How do they get paid? And why do many struggle?",
        date: "2026-01-08",
        author: "Founder",
        category: "Industry"
    },
    {
        slug: "problem-with-overseas-print-farms",
        title: "The Problem With Overseas Print Farms",
        excerpt: "You can get 3D prints from China for incredibly low prices. Why would anyone pay more? Because cheap has costs that don't show up on the invoice.",
        date: "2026-01-08",
        author: "Founder",
        category: "Industry"
    },
    {
        slug: "why-local-manufacturing-matters",
        title: "Why Local Manufacturing Still Matters in 2026",
        excerpt: "The global additive manufacturing market exceeds $31 billion. Much of that shift is local. Here's why distributed production is the future.",
        date: "2026-01-08",
        author: "Founder",
        category: "Industry"
    },
    {
        slug: "environmental-cost-of-cheap-prints",
        title: "The Environmental Cost of 'Cheap' Prints",
        excerpt: "3D printing has a reputation as green technology. The reality is more complicated. Here's what actually impacts the environment.",
        date: "2026-01-08",
        author: "Founder",
        category: "Education"
    },
    {
        slug: "what-happens-after-upload",
        title: "What Happens to Your Files After You Upload Them",
        excerpt: "Where does your file go? Who sees it? When is it deleted? Complete transparency about how we handle your data.",
        date: "2026-01-08",
        author: "Founder",
        category: "Trust"
    },
    {
        slug: "building-trust-in-ai-world",
        title: "Building Trust in a World of AI, Automation, and Cheap Copies",
        excerpt: "When anyone can fake legitimacy, how do you know what's real? Here's how we think about authenticity in 2026.",
        date: "2026-01-08",
        author: "Founder",
        category: "Philosophy"
    },
    {
        slug: "why-3d3d-exists",
        title: "Why 3D3D Exists",
        excerpt: "The maker revolution happened. But somewhere along the way, 3D printing became complicated, expensive, and inaccessible. We're here to fix that.",
        date: "2026-01-08",
        author: "Founder",
        category: "Vision"
    },
    {
        slug: "whats-broken-in-3d-printing",
        title: "What's Actually Broken in 3D Printing Today",
        excerpt: "Ghost listings. Zombie makers. Hidden fees. Why the current platforms don't serve everyday Canadians, and what we're doing differently.",
        date: "2026-01-07",
        author: "Founder",
        category: "Industry"
    },
    {
        slug: "how-we-think-about-trust",
        title: "How We Think About Trust",
        excerpt: "Trust isn't a feature. It's a foundation. Here's our philosophy on transparency, honest pricing, and why we don't fake anything.",
        date: "2026-01-06",
        author: "Founder",
        category: "Philosophy"
    },
    {
        slug: "building-in-public",
        title: "Building in Public: Our Roadmap Philosophy",
        excerpt: "We won't promise features we can't deliver. Here's how we think about roadmaps, what's actually coming, and why we keep it real.",
        date: "2026-01-05",
        author: "Founder",
        category: "Roadmap"
    }
];

/**
 * Blog Index Page
 * Deep educational content establishing voice, philosophy, and expertise.
 */
export default function Blog() {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-tech text-sm">Learn</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold gradient-text mb-6">
                        3D3D Blog
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Deep dives into 3D printing, maker culture, licensing, and the future of local manufacturing.
                        No fluff. No AI-generated filler. Real thinking from real people building a real platform.
                    </p>
                </div>

                {/* Learning Pages CTA */}
                <GlassPanel className="p-6 mb-12 border-secondary/30">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h3 className="font-tech font-bold text-foreground mb-1">New to 3D Printing?</h3>
                            <p className="text-sm text-muted-foreground">
                                Start with our beginner-friendly learning guides — foundational knowledge without the jargon.
                            </p>
                        </div>
                        <Link to="/learn" className="text-secondary hover:underline font-medium flex items-center gap-2">
                            Browse Learning Guides <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </GlassPanel>

                {/* Posts List */}
                <div className="space-y-6 mb-12">
                    {posts.map((post) => (
                        <Link key={post.slug} to={`/blog/${post.slug}`}>
                            <GlassPanel className="p-6 hover:border-primary/50 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                                                {post.category}
                                            </span>
                                            <span className="flex items-center text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {post.date}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-tech font-bold text-foreground mb-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                            <User className="w-3 h-3" />
                                            <span>{post.author}</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-2" />
                                </div>
                            </GlassPanel>
                        </Link>
                    ))}
                </div>

                {/* Subscribe CTA */}
                <GlassPanel className="p-8 text-center">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-4">
                        Stay Updated
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Get occasional updates about new articles, maker stories, and platform news.
                        No spam, ever.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Email subscription coming soon. For now, follow our journey on the site.
                    </p>
                </GlassPanel>
            </div>
        </div>
    );
}
