import { Link } from 'react-router-dom';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { NeonButton } from '@/components/ui/NeonButton';
import { Construction, ArrowLeft } from 'lucide-react';

interface ComingSoonGateProps {
    title: string;
    description?: string;
    returnPath?: string;
    returnLabel?: string;
}

/**
 * Coming Soon Gate Component
 * Honest placeholder for features under development.
 * Used to gate dashboard sections that contain mock data.
 */
export function ComingSoonGate({
    title,
    description = "We're building something great here. Check back soon.",
    returnPath = "/dashboard",
    returnLabel = "Back to Dashboard"
}: ComingSoonGateProps) {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
                <GlassPanel className="p-12">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <Construction className="w-8 h-8 text-primary" />
                    </div>

                    <h1 className="text-3xl font-display font-bold gradient-text mb-4">
                        {title}
                    </h1>

                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                        {description}
                    </p>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            This section is under active development and will be available soon.
                        </p>

                        <Link to={returnPath}>
                            <NeonButton variant="secondary">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {returnLabel}
                            </NeonButton>
                        </Link>
                    </div>
                </GlassPanel>
            </div>
        </div>
    );
}

export default ComingSoonGate;
