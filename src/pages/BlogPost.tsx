import { useParams, Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface PostContent {
    title: string;
    date: string;
    author: string;
    category: string;
    content: React.ReactNode;
}

const postsContent: Record<string, PostContent> = {
    "why-3d3d-exists": {
        title: "Why 3D3D Exists",
        date: "2026-01-08",
        author: "Founder",
        category: "Vision",
        content: (
            <>
                <p>
                    The maker revolution happened. 3D printers went from expensive industrial machines
                    to something you could have in your basement. The technology is here. The potential is real.
                </p>
                <p>
                    But somewhere along the way, 3D printing became complicated, expensive, and inaccessible
                    for everyday people. Want to print a replacement part for your dishwasher? Good luck
                    navigating Thingiverse, finding a maker, understanding file formats, and getting a
                    straight answer on pricing.
                </p>
                <h3>The Gap We're Filling</h3>
                <p>
                    Shapeways left. Xometry focuses on industrial. Etsy and Amazon don't understand making.
                    There's no Canadian platform that makes 3D printing feel approachable, trustworthy,
                    and actually useful for normal people.
                </p>
                <p>
                    That's the gap. And that's why 3D3D exists.
                </p>
                <h3>What We're Building</h3>
                <p>
                    A platform where you can get a quote in under a minute. Where pricing is transparent.
                    Where local makers earn fair wages. Where the whole experience feels like asking
                    a friend who happens to have a 3D printer.
                </p>
                <p>
                    We're starting in Fredericton, New Brunswick. It's small, it's intentional, and
                    it's where we can get things right before we scale.
                </p>
                <p>
                    This isn't a Silicon Valley moonshot. It's a Canadian platform, built for Canadians,
                    by someone who believes making should be accessible to everyone.
                </p>
            </>
        )
    },
    "whats-broken-in-3d-printing": {
        title: "What's Actually Broken in 3D Printing Today",
        date: "2026-01-07",
        author: "Founder",
        category: "Industry",
        content: (
            <>
                <p>
                    Before we can fix something, we need to be honest about what's broken.
                    Here's what I've seen after a year of research and building.
                </p>
                <h3>Ghost Listings</h3>
                <p>
                    Etsy and Amazon are full of listings from makers who stopped responding months ago.
                    You order, you wait, you get nothing. There's no accountability.
                </p>
                <h3>Hidden Fees</h3>
                <p>
                    "Just $5!" turns into $25 after shipping, handling, platform fees, and mysterious
                    "processing charges." Nobody trusts online pricing anymore, and for good reason.
                </p>
                <h3>Quality Roulette</h3>
                <p>
                    You have no idea if you're getting PLA, PETG, or some recycled plastic mixed
                    with prayer. There's no standardization, no verification, no trust.
                </p>
                <h3>Maker Exploitation</h3>
                <p>
                    Most platforms take 15-25% from makers while providing minimal support.
                    Makers race to the bottom on pricing, quality suffers, everyone loses.
                </p>
                <h3>What We're Doing Different</h3>
                <p>
                    Every maker on 3D3D is verified. Every price includes everything.
                    Every order is tracked and accountable. We take a transparent platform fee,
                    and we make sure makers earn enough to do good work.
                </p>
                <p>
                    Trust isn't a marketing claim. It's the entire architecture of how we work.
                </p>
            </>
        )
    },
    "how-we-think-about-trust": {
        title: "How We Think About Trust",
        date: "2026-01-06",
        author: "Founder",
        category: "Philosophy",
        content: (
            <>
                <p>
                    Trust isn't a feature you add at the end. It's not a badge you display.
                    Trust is a foundation that everything else is built on.
                </p>
                <h3>Our Trust Principles</h3>
                <p><strong>Honest Pricing:</strong> The price you see is the price you pay.
                    No hidden fees, no surprise charges, no "processing" costs that appear at checkout.</p>
                <p><strong>No Fake Anything:</strong> If a feature isn't built, we say so.
                    If a statistic isn't real, we don't show it. Our dashboards show real data, not mockups.</p>
                <p><strong>Verified Makers:</strong> We meet our makers. We see their work.
                    We don't let anyone list until we know they can deliver.</p>
                <p><strong>Transparent Platform Fees:</strong> We show you exactly what we take
                    and what the maker earns. No ambiguity.</p>
                <h3>Why This Matters</h3>
                <p>
                    Because you've been burned before. By platforms that promised quality and delivered garbage.
                    By listing sites that let anyone claim anything. By marketplaces that optimize for their
                    commission, not your experience.
                </p>
                <p>
                    We're building 3D3D for people who are tired of that. People who want to make things,
                    not fight the system.
                </p>
            </>
        )
    },
    "building-in-public": {
        title: "Building in Public: Our Roadmap Philosophy",
        date: "2026-01-05",
        author: "Founder",
        category: "Roadmap",
        content: (
            <>
                <p>
                    We've all seen the "coming soon" promises that never arrive. The feature roadmaps
                    that become feature graveyards. The startup announcements that quietly disappear.
                </p>
                <p>
                    We're trying something different: radical honesty about what we're building.
                </p>
                <h3>What's Actually Ready</h3>
                <ul>
                    <li>Quote flow with real backend pricing</li>
                    <li>User authentication and profiles</li>
                    <li>Maker infrastructure and verification system</li>
                    <li>Legal compliance for Canada (CASL, PIPEDA)</li>
                </ul>
                <h3>What's In Development</h3>
                <ul>
                    <li>Payment processing (we're integrating, not live)</li>
                    <li>Order tracking and delivery updates</li>
                    <li>Advanced material matching</li>
                    <li>Brand-Games interactive features</li>
                </ul>
                <h3>What's Future (No Timeline)</h3>
                <ul>
                    <li>Mobile apps</li>
                    <li>Design assistance AI</li>
                    <li>Maker network expansion beyond NB</li>
                </ul>
                <h3>Why We Share This</h3>
                <p>
                    Because we'd rather have you trust our process than believe our promises.
                    What we ship matters more than what we plan to ship.
                </p>
            </>
        )
    },
    "printing-isnt-piracy": {
        title: "Printing Isn't Piracy: How to Respect Designers and Still Make Things",
        date: "2026-01-08",
        author: "Founder",
        category: "Education",
        content: (
            <>
                <p>
                    There's a tension in the 3D printing world that nobody talks about honestly:
                    How do you print cool things while respecting the people who designed them?
                </p>
                <p>
                    Let's be clear upfront: <strong>Printing is not piracy.</strong> Using a 3D printer
                    to make things is wonderful. But how you get the files matters.
                </p>
                <h3>The Difference That Matters</h3>
                <p>
                    When you download a file from Thingiverse with a Creative Commons license that says
                    "free for personal use," and you print it for yourself — that's great. That's exactly
                    how it's supposed to work.
                </p>
                <p>
                    When you download that same file and start selling prints on Etsy without permission?
                    That's not printing. That's taking someone's work without paying for it.
                </p>
                <h3>How to Know If You're Good</h3>
                <p><strong>You're probably fine if:</strong></p>
                <ul>
                    <li>You designed it yourself</li>
                    <li>You bought the file with commercial rights</li>
                    <li>The license explicitly allows what you're doing</li>
                    <li>You have written permission from the creator</li>
                    <li>It's truly public domain (not just "I found it online")</li>
                </ul>
                <p><strong>You should pause if:</strong></p>
                <ul>
                    <li>The file says "personal use only" and you're selling prints</li>
                    <li>You found it on a site known for pirated content</li>
                    <li>You're not sure where the file came from</li>
                    <li>You're avoiding the question because you don't want to know the answer</li>
                </ul>
                <h3>What About "Grey Areas"?</h3>
                <p>
                    Here's the honest truth: there are grey areas. A file you made for yourself that
                    a friend wants to buy. A design that's "inspired by" something else. A remix of
                    someone's work.
                </p>
                <p>
                    Our advice: when in doubt, reach out. Most designers are happy to work with you.
                    They'd rather sell you a license than chase you for infringement. A simple email
                    asking "can I sell prints of this?" goes a long way.
                </p>
                <h3>How 3D3D Handles This</h3>
                <p>
                    We're a print service, not a license inspector. We don't scan your files or run
                    AI detection. When you upload a file, you confirm you have the right to print it.
                    That's on you.
                </p>
                <p>
                    But we're not neutral enablers either. We refuse obvious violations. We offer
                    a designer opt-out program. We don't knowingly print pirated content.
                </p>
                <p>
                    Most importantly, we're building a store where you can buy files with clear
                    commercial rights. If you want to print and sell, start there.
                </p>
                <h3>The Bigger Picture</h3>
                <p>
                    Designers make the 3D printing community possible. Without people creating and
                    sharing models, we'd all be 3D printing basic cubes. When you respect creators,
                    you keep the ecosystem healthy.
                </p>
                <p>
                    Printing isn't piracy. Printing is wonderful. Just make sure the file you're
                    printing came from the right place.
                </p>
            </>
        )
    }
};

/**
 * Blog Post Page
 * Individual post with full content.
 */
export default function BlogPost() {
    const { slug } = useParams();
    const post = slug ? postsContent[slug] : null;

    if (!post) {
        return (
            <div className="min-h-screen bg-background py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                        Post Not Found
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        This post doesn't exist or has been moved.
                    </p>
                    <Link to="/blog">
                        <NeonButton variant="primary">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Blog
                        </NeonButton>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Back Link */}
                <Link to="/blog" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                            {post.category}
                        </span>
                        <span className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-1" />
                            {post.date}
                        </span>
                        <span className="flex items-center text-sm text-muted-foreground">
                            <User className="w-4 h-4 mr-1" />
                            {post.author}
                        </span>
                    </div>
                    <h1 className="text-4xl font-display font-bold gradient-text">
                        {post.title}
                    </h1>
                </div>

                {/* Content */}
                <GlassPanel className="p-8 mb-12">
                    <div className="prose prose-invert max-w-none">
                        <div className="space-y-4 text-muted-foreground [&>h3]:text-foreground [&>h3]:font-tech [&>h3]:font-bold [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-4 [&>p]:leading-relaxed [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:pl-5">
                            {post.content}
                        </div>
                    </div>
                </GlassPanel>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-muted-foreground mb-6">
                        Have thoughts? Reach out at hello@3d3d.ca
                    </p>
                    <Link to="/blog">
                        <NeonButton variant="secondary">
                            Read More Posts
                        </NeonButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
