import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { Gamepad2, Sparkles, Gift, Dice6 } from 'lucide-react';

/**
 * Brand-Games Page
 * A philosophical + experiential differentiator, not a gimmick.
 * Showcases creative challenges that bridge imagination and making.
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
    ];

    const handleSpinWheel = () => {
        if (wheelSpun) return;
        setWheelSpun(true);
        const result = challenges[Math.floor(Math.random() * challenges.length)];
        setTimeout(() => setSpinResult(result), 1500);
    };

    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <Gamepad2 className="w-5 h-5" />
                        <span className="font-tech text-sm">Brand-Games</span>
                    </div>
                    <h1 className="text-5xl font-display font-bold gradient-text mb-6">
                        Where Imagination Gets Playful
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Brand-Games are creative challenges that turn ideas into tangible things.
                        Think of them as playful quests for your maker spirit.
                    </p>
                </div>

                {/* Philosophy */}
                <GlassPanel className="mb-12 p-8">
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-4">
                        Why Games?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Making something new can feel intimidating. What if it's not perfect?
                        What if you don't know where to start?
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        Games change that. They give you a starting point, a constraint, a nudge.
                        They make the blank page feel less scary and more like an invitation.
                    </p>
                    <p className="text-foreground font-medium">
                        We believe everyone is a maker. Sometimes you just need permission to play.
                    </p>
                </GlassPanel>

                {/* Game Concepts */}
                <h2 className="text-2xl font-tech font-bold text-foreground mb-8 text-center">
                    Coming Soon
                    <span className="block text-sm font-normal text-muted-foreground mt-2">
                        In Development - Playable games launching Q2 2026
                    </span>
                </h2>

                <div className="grid gap-8 mb-12">
                    {/* Game 1: Maker's Quest */}
                    <GlassPanel className="p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-tech font-bold text-foreground">
                                        Maker's Quest
                                    </h3>
                                    <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                                        In Development
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-3">
                                    A 20-minute story game where your choices become real objects.
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>Design a shield for a traveling hero</li>
                                    <li>Create a tool for a curious inventor</li>
                                    <li>Build a gift for someone who has everything</li>
                                </ul>
                                <p className="text-sm text-primary/80 mt-3 italic">
                                    Your story, your design, made real.
                                </p>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Game 2: Trade Show Challenge */}
                    <GlassPanel className="p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                                <Dice6 className="w-6 h-6 text-secondary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-tech font-bold text-foreground">
                                        Trade Show Challenge
                                    </h3>
                                    <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                                        In Development
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-3">
                                    30-minute design sprint. Create something impressive, fast.
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>Random constraints keep it fresh</li>
                                    <li>Perfect for maker events and conventions</li>
                                    <li>Compete or collaborate with other makers</li>
                                </ul>
                                <p className="text-sm text-secondary/80 mt-3 italic">
                                    Pressure creates diamonds. And cool prints.
                                </p>
                            </div>
                        </div>
                    </GlassPanel>

                    {/* Game 3: Spin & Create */}
                    <GlassPanel className="p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                <Gift className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-tech font-bold text-foreground">
                                        Spin & Create
                                    </h3>
                                    <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                                        In Development
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-3">
                                    Fair, transparent randomizer for creative challenges and material bonuses.
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>Get random design prompts when you're stuck</li>
                                    <li>Occasional material discounts (clearly odds-disclosed)</li>
                                    <li>No dark patterns, no manipulation</li>
                                </ul>
                                <p className="text-sm text-accent/80 mt-3 italic">
                                    Chance favors the curious.
                                </p>
                            </div>
                        </div>
                    </GlassPanel>
                </div>

                {/* Interactive Demo Element */}
                <GlassPanel className="p-8 text-center mb-12">
                    <p className="text-sm text-muted-foreground mb-4">
                        Demo: Get a random creative challenge (clearly labeled as demo)
                    </p>

                    {!spinResult ? (
                        <NeonButton
                            onClick={handleSpinWheel}
                            disabled={wheelSpun && !spinResult}
                            variant="secondary"
                        >
                            {wheelSpun ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">...</span>
                                    Thinking...
                                </span>
                            ) : (
                                "Give Me a Challenge"
                            )}
                        </NeonButton>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-lg font-tech text-primary">
                                "{spinResult}"
                            </p>
                            <p className="text-sm text-muted-foreground">
                                What would you make?
                            </p>
                            <NeonButton
                                onClick={() => { setWheelSpun(false); setSpinResult(null); }}
                                variant="ghost"
                            >
                                Try Another
                            </NeonButton>
                        </div>
                    )}
                </GlassPanel>

                {/* CTA */}
                <div className="text-center">
                    <p className="text-muted-foreground mb-6">
                        Want to make something right now? Start with a quote.
                    </p>
                    <Link to="/quote">
                        <NeonButton variant="primary">
                            Get a Quote
                        </NeonButton>
                    </Link>
                </div>
            </div>
        </div>
    );
}
