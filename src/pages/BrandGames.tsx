import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { Gamepad2, Sparkles, Gift, Dice6, Swords, Users, Trophy, Clock, Zap, Target } from 'lucide-react';

/**
 * Brand-Games Hub
 * A philosophical + experiential differentiator.
 * Games that bridge imagination and making — not gimmicks.
 */
export default function BrandGames() {
    const [wheelSpun, setWheelSpun] = useState(false);
    const [spinResult, setSpinResult] = useState<string | null>(null);

    const challenges = [
        "Design something that makes someone smile",
        "Create a tool for an impossible job",
        "Build a gift for your future self",
        "Print a solution to a tiny annoyance",
        "Make something that tells a story",
        "Create a functional object that fits in your pocket",
        "Design something your grandmother would find useful",
        "Build a toy with exactly three moving parts",
    ];

    const handleSpinWheel = () => {
        if (wheelSpun) return;
        setWheelSpun(true);
        const result = challenges[Math.floor(Math.random() * challenges.length)];
        setTimeout(() => setSpinResult(result), 1500);
    };

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <Gamepad2 className="w-5 h-5" />
                        <span className="font-tech text-sm">Brand-Games</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold gradient-text mb-6">
                        Where Imagination Becomes Reality
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Brand-Games are creative experiences that transform ideas into tangible things.
                        Not gamification. Not rewards programs. Real games that make you a better maker.
                    </p>
                </div>

                {/* Philosophy Section */}
                <GlassPanel className="mb-12 p-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-6">
                        Why Games Belong in Making
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                Every maker knows the feeling: you have tools, materials, and time, but no idea
                                what to make. The blank canvas is intimidating. "I could print anything" becomes
                                "I'll print nothing."
                            </p>
                            <p>
                                Games solve this. A constraint, a prompt, a challenge — suddenly you have
                                a direction. The pressure of infinite choice dissolves into the freedom of
                                focused creation.
                            </p>
                        </div>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                We're not adding games to 3D3D because they're trendy. We're adding them
                                because they work. Creative constraints produce creative results.
                                Time pressure forces decisions. Competition drives improvement.
                            </p>
                            <p className="text-foreground font-medium">
                                The most innovative makers play. Brand-Games gives you permission to.
                            </p>
                        </div>
                    </div>
                </GlassPanel>

                {/* Status Indicator */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Challenge Generator: LIVE
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm">
                        <Clock className="w-3 h-3" />
                        Full Games: Q2 2026
                    </div>
                </div>

                {/* Game Cards */}
                <div className="grid gap-8 mb-12">
                    {/* Game 1: Maker's Quest RPG */}
                    <GlassPanel className="p-8 border-primary/20">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Swords className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-tech font-bold text-foreground">
                                        Maker's Quest
                                    </h3>
                                    <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded-full">
                                        Coming Q2 2026
                                    </span>
                                </div>
                                <p className="text-lg text-muted-foreground mb-4">
                                    A 20-minute browser RPG where your design choices become real, printable objects.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="font-tech font-bold text-foreground mb-2">The Story</h4>
                                        <p className="text-sm text-muted-foreground">
                                            You're a traveling artisan in a world where creation is currency.
                                            Villages need tools, heroes need weapons, inventors need prototypes.
                                            Every choice you make shapes what you'll design — and at the end,
                                            you can print your creation for real.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-tech font-bold text-foreground mb-2">How It Works</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Choose your path: helper, inventor, or artist</li>
                                            <li>• Face design challenges based on story needs</li>
                                            <li>• Your choices constrain your final design brief</li>
                                            <li>• Receive a printable STL matching your journey</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-background/50">
                                    <h4 className="font-tech font-bold text-foreground mb-2">Why This Game Exists</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Most people don't know what they want to make until they're given context.
                                        Maker's Quest provides that context through story. By the time you finish,
                                        you're not just downloading a file — you're completing your quest.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Game 2: Trade Show Challenge */}
                    <GlassPanel className="p-8 border-secondary/20">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                <Trophy className="w-8 h-8 text-secondary" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-tech font-bold text-foreground">
                                        Trade Show Challenge
                                    </h3>
                                    <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded-full">
                                        Coming Q2 2026
                                    </span>
                                </div>
                                <p className="text-lg text-muted-foreground mb-4">
                                    A 30-minute competitive design sprint for maker events and conventions.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="font-tech font-bold text-foreground mb-2">The Experience</h4>
                                        <p className="text-sm text-muted-foreground">
                                            At a real-world maker event, participants receive random constraints:
                                            a time limit, a material, a function, a size. They sketch, prototype,
                                            and present. Crowd voting determines winners. Designs get printed
                                            on-site when printers are available.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-tech font-bold text-foreground mb-2">Game Mechanics</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Random constraint generator (digital or physical cards)</li>
                                            <li>• Timer sync across all participants</li>
                                            <li>• Presentation format with structured judging</li>
                                            <li>• Categories: Most Creative, Most Practical, Best Story</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-background/50">
                                    <h4 className="font-tech font-bold text-foreground mb-2">Real-World Connection</h4>
                                    <p className="text-sm text-muted-foreground">
                                        This isn't a digital game — it's a format for live events. We provide
                                        the structure, the constraints, and the printability check. Communities
                                        provide the creativity. Perfect for makerspaces, conventions, and
                                        school events.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Game 3: Creative Challenge Generator */}
                    <GlassPanel className="p-8 border-accent/20">
                        <div className="flex items-start gap-6">
                            <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-8 h-8 text-accent" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-tech font-bold text-foreground">
                                        Creative Challenge Generator
                                    </h3>
                                    <span className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded-full">
                                        LIVE NOW
                                    </span>
                                </div>
                                <p className="text-lg text-muted-foreground mb-4">
                                    Instant creative prompts when you're stuck. No accounts, no tracking, no dark patterns.
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h4 className="font-tech font-bold text-foreground mb-2">How It Works</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Press the button. Get a challenge. Make something. That's it.
                                            We're not tracking what you click. We're not building a profile.
                                            We're just helping you get unstuck.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-tech font-bold text-foreground mb-2">Challenge Types</h4>
                                        <ul className="text-sm text-muted-foreground space-y-1">
                                            <li>• Functional objects with constraints</li>
                                            <li>• Gifts for specific recipients</li>
                                            <li>• Solutions to everyday problems</li>
                                            <li>• Design exercises with limitations</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* Live Challenge Generator */}
                <GlassPanel className="p-8 text-center mb-12 border-green-500/20">
                    <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span className="text-sm font-tech">LIVE — Try it now</span>
                    </div>
                    <h3 className="text-xl font-tech font-bold text-foreground mb-4">
                        Get a Creative Challenge
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                        Stuck on what to make? Let randomness guide you. No signup required.
                        No data collected. Just a prompt and your imagination.
                    </p>

                    {!spinResult ? (
                        <NeonButton
                            onClick={handleSpinWheel}
                            disabled={wheelSpun && !spinResult}
                            variant="secondary"
                            className="min-w-48"
                        >
                            {wheelSpun ? (
                                <span className="flex items-center gap-2">
                                    <Dice6 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Dice6 className="w-4 h-4" />
                                    Give Me a Challenge
                                </span>
                            )}
                        </NeonButton>
                    ) : (
                        <div className="space-y-6">
                            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                                <p className="text-xl font-tech text-primary">
                                    "{spinResult}"
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <NeonButton
                                    onClick={() => { setWheelSpun(false); setSpinResult(null); }}
                                    variant="ghost"
                                >
                                    Try Another
                                </NeonButton>
                                <Link to="/quote">
                                    <NeonButton variant="primary">
                                        Start Making
                                    </NeonButton>
                                </Link>
                            </div>
                        </div>
                    )}
                </GlassPanel>

                {/* Philosophy Footer */}
                <div className="text-center space-y-6">
                    <GlassPanel className="p-6 inline-block">
                        <p className="text-muted-foreground max-w-xl">
                            <span className="text-foreground font-medium">No dark patterns.</span>{' '}
                            We don't use loot boxes, manipulative timers, or artificial scarcity.
                            Games should inspire, not exploit.
                        </p>
                    </GlassPanel>

                    <div>
                        <p className="text-muted-foreground mb-6">
                            Ready to make something? Skip the games and start directly.
                        </p>
                        <Link to="/quote">
                            <NeonButton variant="primary" icon={<Target className="w-4 h-4" />}>
                                Get a Quote
                            </NeonButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
