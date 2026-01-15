import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useUserData';
import { supabase } from '@/integrations/supabase/client';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft, User, Mail, Phone, MapPin, Save,
  Camera, CheckCircle, AlertCircle, Bell
} from 'lucide-react';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[\d\s\-+()]*$/, 'Invalid phone format').optional().or(z.literal('')),
  address_line1: z.string().max(200).optional().or(z.literal('')),
  address_line2: z.string().max(200).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  province: z.string().max(100).optional().or(z.literal('')),
  postal_code: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid Canadian postal code').optional().or(z.literal('')),
});

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading, refetch } = useProfile();
  const { toast } = useToast();

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    province: '',
    postal_code: '',
  });
  const [caslConsent, setCaslConsent] = useState(false);
  const [caslSaving, setCaslSaving] = useState(false);
  const [caslError, setCaslError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address_line1: profile.address_line1 || '',
        address_line2: profile.address_line2 || '',
        city: profile.city || '',
        province: profile.province || '',
        postal_code: profile.postal_code || '',
      });
      // Load CASL consent state from profile
      const consentValue = (profile as { consent_email_marketing?: boolean | null }).consent_email_marketing;
      setCaslConsent(Boolean(consentValue));
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSave = async () => {
    try {
      const validated = profileSchema.parse(formData);
      setSaving(true);
      setErrors({});

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: validated.full_name,
          phone: validated.phone || null,
          address_line1: validated.address_line1 || null,
          address_line2: validated.address_line2 || null,
          city: validated.city || null,
          province: validated.province || null,
          postal_code: validated.postal_code || null,
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refetch();
      toast({
        title: "Profile Updated!",
        description: "Your changes have been saved successfully.",
      });
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) fieldErrors[e.path[0] as string] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        const message = err instanceof Error ? err.message : "Failed to update profile";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCaslToggle = async (checked: boolean) => {
    setCaslSaving(true);
    setCaslError(null);
    setCaslConsent(checked);

    const updateData = checked
      ? {
        consent_email_marketing: true,
        consent_email_timestamp: new Date().toISOString(),
        consent_ip_address: null, // Best-effort: IP not safely obtainable client-side
      }
      : {
        consent_email_marketing: false,
        consent_email_timestamp: null,
        consent_ip_address: null,
      };

    const { error } = await supabase
      .from('profiles')
      .update(updateData as Record<string, unknown>)
      .eq('id', user?.id);

    if (error) {
      setCaslError('Failed to save preference. Please try again.');
      setCaslConsent(!checked); // Revert
      console.error('CASL toggle error:', error);
    } else {
      toast({
        title: checked ? 'Marketing emails enabled' : 'Marketing emails disabled',
        description: checked
          ? 'You will receive community updates and promotions.'
          : 'You will only receive essential account notifications.',
      });
    }

    setCaslSaving(false);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <AnimatedLogo size="lg" />
        </div>
      </div>
    );
  }

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
    'Prince Edward Island', 'Quebec', 'Saskatchewan',
    'Northwest Territories', 'Nunavut', 'Yukon'
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </button>
              </Link>
              <AnimatedLogo size="sm" />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-tech font-bold text-foreground mb-2">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Complete your profile to earn bonus points and unlock features
            </p>
          </motion.div>

          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <GlowCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-foreground">Profile Completion</span>
                <span className="text-2xl font-tech font-bold text-secondary">
                  {profile?.profile_completion_percent || 0}%
                </span>
              </div>
              <Progress value={profile?.profile_completion_percent || 0} className="h-3" />
              {(profile?.profile_completion_percent || 0) < 100 && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Complete your profile to earn <span className="text-secondary font-semibold">250 bonus points!</span>
                </p>
              )}
            </GlowCard>
          </motion.div>

          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <GlowCard className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-background" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary-glow transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{profile?.full_name || 'Your Name'}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  <p className="text-xs text-secondary mt-1">Member since {new Date(profile?.created_at || '').toLocaleDateString('en-CA', { month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlowCard className="p-6">
              <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                Personal Information
              </h3>

              <div className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-foreground">Full Name *</Label>
                  <div className="relative">
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                      className={`bg-input border-border ${errors.full_name ? 'border-destructive' : ''}`}
                    />
                    {errors.full_name && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.full_name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className={`pl-10 bg-input border-border ${errors.phone ? 'border-destructive' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    Shipping Address
                  </h4>

                  <div className="space-y-2">
                    <Label htmlFor="address_line1" className="text-muted-foreground text-sm">Address Line 1</Label>
                    <Input
                      id="address_line1"
                      value={formData.address_line1}
                      onChange={(e) => handleChange('address_line1', e.target.value)}
                      placeholder="123 Main Street"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_line2" className="text-muted-foreground text-sm">Address Line 2</Label>
                    <Input
                      id="address_line2"
                      value={formData.address_line2}
                      onChange={(e) => handleChange('address_line2', e.target.value)}
                      placeholder="Apartment, suite, unit, etc."
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-muted-foreground text-sm">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Toronto"
                        className="bg-input border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-muted-foreground text-sm">Province</Label>
                      <select
                        id="province"
                        value={formData.province}
                        onChange={(e) => handleChange('province', e.target.value)}
                        className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                      >
                        <option value="">Select...</option>
                        {provinces.map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code" className="text-muted-foreground text-sm">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => handleChange('postal_code', e.target.value.toUpperCase())}
                      placeholder="M5V 1A1"
                      className={`bg-input border-border max-w-[200px] ${errors.postal_code ? 'border-destructive' : ''}`}
                    />
                    {errors.postal_code && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.postal_code}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <NeonButton
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </NeonButton>
              </div>
            </GlowCard>
          </motion.div>

          {/* CASL Marketing Consent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <GlowCard className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-secondary" />
                Email Preferences
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="casl-marketing"
                    checked={caslConsent}
                    onCheckedChange={(checked) => handleCaslToggle(checked === true)}
                    disabled={caslSaving}
                    className="mt-1"
                  />
                  <label htmlFor="casl-marketing" className="text-sm text-foreground cursor-pointer leading-relaxed">
                    I consent to receiving marketing emails from 3D3D Canada about community news, promotions, and maker updates.
                    <span className="block text-xs text-muted-foreground mt-1">
                      You can change this anytime. Order confirmations and account notifications are always sent.
                    </span>
                  </label>
                </div>

                {caslError && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{caslError}</span>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Required by Canada's Anti-Spam Legislation (CASL). Your preference is recorded with a timestamp.
                </p>
              </div>
            </GlowCard>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;
