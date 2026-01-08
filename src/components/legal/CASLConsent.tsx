import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CASLConsentProps {
    onConsentChange: (consented: boolean, timestamp: Date | null) => void;
    className?: string;
}

/**
 * CASL Compliance Component
 * Canadian Anti-Spam Legislation requires explicit opt-in consent
 * with timestamp logging for commercial electronic messages.
 */
export function CASLConsent({ onConsentChange, className = '' }: CASLConsentProps) {
    const [consented, setConsented] = useState(false);

    const handleChange = (checked: boolean) => {
        setConsented(checked);
        onConsentChange(checked, checked ? new Date() : null);
    };

    return (
        <div className={`flex items-start space-x-3 ${className}`}>
            <Checkbox
                id="casl-consent"
                checked={consented}
                onCheckedChange={handleChange}
                className="mt-1"
            />
            <Label htmlFor="casl-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                I consent to receiving emails from 3D3D Canada about my orders, account updates,
                and maker community news. I can unsubscribe anytime by clicking the link in any email.
                <span className="block text-xs mt-1 opacity-75">
                    Required by Canada's Anti-Spam Legislation (CASL)
                </span>
            </Label>
        </div>
    );
}

export default CASLConsent;
