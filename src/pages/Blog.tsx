import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { Calendar, ArrowRight, User } from 'lucide-react';

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
 * Foundational content establishing voice and philosophy.
 */
export default function Blog() {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-display font-bold gradient-text mb-6">
                        Updates & Thoughts
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Honest reflections from building a maker platform in Canada.
                        No fluff, no hype, just real talk.
                    </p>
                </div>

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
                        Get occasional updates about new features, maker stories, and platform news.
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
