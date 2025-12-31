import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/sections/Footer';
import ParticleBackground from '@/components/ui/ParticleBackground';
import AmbientGlow from '@/components/ui/AmbientGlow';
import { GlowCard } from '@/components/ui/GlowCard';
import NeonButton from '@/components/ui/NeonButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmitBuybackRequest, BuybackItemType } from '@/hooks/useBuybackData';
import { 
  Recycle, Printer, Cpu, CircleDot, Heart, Leaf, Shield, MapPin,
  CheckCircle2, XCircle, DollarSign, Send, Loader2, ChevronRight,
  Package, Zap, AlertTriangle
} from 'lucide-react';

const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 
  'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon'
];

const CONDITIONS = [
  { value: 'like_new', label: 'Like New / Minimal Use' },
  { value: 'operational', label: 'Fully Operational' },
  { value: 'operational_issues', label: 'Operational with Issues' },
  { value: 'parts_only', label: 'Parts / Not Working' },
];

const RecycleBuyback = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const submitMutation = useSubmitBuybackRequest();

  const [formData, setFormData] = useState({
    item_type: '' as BuybackItemType | '',
    brand_model: '',
    condition: '',
    notes: '',
    photo_url: '',
    city: '',
    province: '',
    contact_email: user?.email || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item_type || !formData.contact_email) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in item type and contact email.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await submitMutation.mutateAsync({
        item_type: formData.item_type as BuybackItemType,
        brand_model: formData.brand_model || undefined,
        condition: formData.condition || undefined,
        notes: formData.notes || undefined,
        photo_url: formData.photo_url || undefined,
        city: formData.city || undefined,
        province: formData.province || undefined,
        contact_email: formData.contact_email,
        guest_email: !user ? formData.contact_email : undefined,
      });

      toast({
        title: 'Request Submitted!',
        description: 'We\'ll review your item and get back to you with a quote.',
      });

      // Reset form
      setFormData({
        item_type: '',
        brand_model: '',
        condition: '',
        notes: '',
        photo_url: '',
        city: '',
        province: '',
        contact_email: user?.email || '',
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Sell Used 3D Printers & Recycle Electronics | 3D3D Canada</title>
        <meta 
          name="description" 
          content="We buy used 3D printers, accept electronics for recycling, and purchase partially-used filament spools. Fair prices, Atlantic Canadian roots, and zero landfill commitment." 
        />
        <meta name="keywords" content="recycle 3D printers Canada, sell used 3D printer, electronics drop-off, buy filament spools, 3D printer trade-in" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground relative">
        <ParticleBackground />
        <AmbientGlow />
        <Navbar />

        <main className="pt-24 pb-16">
          {/* Hero Section */}
          <section className="relative py-16 lg:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/30 text-success text-sm font-medium mb-6">
                  <Recycle className="w-4 h-4" />
                  CIRCULAR ECONOMY INITIATIVE
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-tech font-bold text-foreground mb-6">
                  We Buy Used 3D Printers •{' '}
                  <span className="gradient-text">Recycle Electronics</span> •{' '}
                  Buy Partially-Used Filament
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Got old gear sitting around? We'll give it a second life. Fair prices, Atlantic Canadian roots, 
                  and a commitment to keeping good machines out of landfills.
                </p>

                {/* Trust Blocks */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                  {[
                    { icon: MapPin, label: 'Atlantic Roots', desc: 'Local pickup in NS' },
                    { icon: Shield, label: 'Fair & Transparent', desc: 'No hidden fees' },
                    { icon: Leaf, label: 'Zero Landfill', desc: 'We repurpose everything' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card/50 border border-border">
                      <item.icon className="w-5 h-5 text-secondary" />
                      <div className="text-left">
                        <div className="text-sm font-bold text-foreground">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tabs for Categories */}
              <Tabs defaultValue="printers" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-xl mx-auto mb-8 bg-card/50 p-1">
                  <TabsTrigger value="printers" className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">3D Printers</span>
                    <span className="sm:hidden">Printers</span>
                  </TabsTrigger>
                  <TabsTrigger value="electronics" className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                    <Cpu className="w-4 h-4" />
                    Electronics
                  </TabsTrigger>
                  <TabsTrigger value="filament" className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                    <CircleDot className="w-4 h-4" />
                    Filament
                  </TabsTrigger>
                </TabsList>

                {/* Printers Tab */}
                <TabsContent value="printers">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-tech font-bold text-foreground mb-2">Used 3D Printers (FDM)</h2>
                      <p className="text-muted-foreground">Estimated ranges based on Canadian market. Final quote after review.</p>
                    </div>

                    {/* Pricing Table */}
                    <GlowCard className="overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/30">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-tech font-bold text-foreground">Printer Class</th>
                              <th className="px-4 py-3 text-left text-sm font-tech font-bold text-foreground">Typical Range (CAD)</th>
                              <th className="px-4 py-3 text-left text-sm font-tech font-bold text-secondary">
                                <CheckCircle2 className="w-4 h-4 inline mr-1" />
                                Increases Value
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-tech font-bold text-destructive">
                                <XCircle className="w-4 h-4 inline mr-1" />
                                Reduces Value
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <tr className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-4">
                                <div className="font-medium text-foreground">Entry-Level Bedslingers</div>
                                <div className="text-xs text-muted-foreground">Ender 3, Anycubic Kobra, etc.</div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-lg font-tech font-bold text-secondary">$50 – $200</span>
                              </td>
                              <td className="px-4 py-4 text-sm text-muted-foreground">
                                All-metal hotend, linear rails, dual Z
                              </td>
                              <td className="px-4 py-4 text-sm text-muted-foreground">
                                Missing parts, worn belts, damaged bed
                              </td>
                            </tr>
                            <tr className="hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-4">
                                <div className="font-medium text-foreground">Prosumer Machines</div>
                                <div className="text-xs text-muted-foreground">Prusa MK3/MK4, Voron, RatRig</div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-lg font-tech font-bold text-secondary">$450 – $900</span>
                              </td>
                              <td className="px-4 py-4 text-sm text-muted-foreground">
                                Enclosure, MMU, spare parts included
                              </td>
                              <td className="px-4 py-4 text-sm text-muted-foreground">
                                Incomplete kit, firmware issues
                              </td>
                            </tr>
                            <tr className="hover:bg-muted/20 transition-colors bg-primary/5">
                              <td className="px-4 py-4">
                                <div className="font-medium text-foreground flex items-center gap-2">
                                  High-Speed / Premium
                                  <span className="px-2 py-0.5 text-xs rounded bg-primary/20 text-primary border border-primary/30">HOT</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Bambu P1S/X1C, K1 Max, etc.</div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-lg font-tech font-bold text-primary">Higher Value</span>
                                <div className="text-xs text-muted-foreground">Request quote for best offer</div>
                              </td>
                              <td className="px-4 py-4 text-sm text-muted-foreground">
                                AMS, original packaging, low hours
                              </td>
                              <td className="px-4 py-4 text-sm text-muted-foreground">
                                Nozzle wear, cloud account issues
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </GlowCard>

                    {/* Condition Ladder */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { 
                          title: 'Near-New / Operational',
                          desc: 'Prints great, minimal wear, all parts present',
                          multiplier: '100%',
                          color: 'text-success border-success/30 bg-success/5'
                        },
                        { 
                          title: 'Operational w/ Issues',
                          desc: 'Works but needs TLC (bed leveling, worn nozzle, etc.)',
                          multiplier: '60-80%',
                          color: 'text-warning border-warning/30 bg-warning/5'
                        },
                        { 
                          title: 'Parts Donor / Broken',
                          desc: 'Not printing but salvageable components',
                          multiplier: '20-40%',
                          color: 'text-destructive border-destructive/30 bg-destructive/5'
                        },
                      ].map((item) => (
                        <GlowCard key={item.title} className={`border ${item.color}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-tech font-bold text-foreground">{item.title}</h3>
                            <span className="text-sm font-mono">{item.multiplier}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </GlowCard>
                      ))}
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        All prices are estimates. Final quote provided after inspection.
                      </p>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Electronics Tab */}
                <TabsContent value="electronics">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-tech font-bold text-foreground mb-2">Electronics Recycling</h2>
                      <p className="text-muted-foreground">Free drop-off for items we can use in workshops & repairs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <GlowCard variant="teal">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-success/10 border border-success/30 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-6 h-6 text-success" />
                          </div>
                          <div>
                            <h3 className="font-tech font-bold text-foreground mb-3">We Accept</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-secondary" /> Stepper motors & drivers</li>
                              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-secondary" /> Power supplies (tested working)</li>
                              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-secondary" /> Fans, heatsinks, cooling components</li>
                              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-secondary" /> Arduino, Raspberry Pi, microcontrollers</li>
                              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-secondary" /> Linear rails, lead screws, bearings</li>
                              <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-secondary" /> Touchscreens, displays, control boards</li>
                            </ul>
                          </div>
                        </div>
                      </GlowCard>

                      <GlowCard>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center justify-center shrink-0">
                            <XCircle className="w-6 h-6 text-destructive" />
                          </div>
                          <div>
                            <h3 className="font-tech font-bold text-foreground mb-3">Contact First</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-destructive/60" /> Batteries (LiPo, Li-ion) - special handling</li>
                              <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-destructive/60" /> CRT monitors</li>
                              <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-destructive/60" /> Large appliances</li>
                              <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-destructive/60" /> Heavily damaged / corroded items</li>
                            </ul>
                            <p className="text-xs text-muted-foreground mt-4">
                              Unsure? Send us a photo and we'll let you know!
                            </p>
                          </div>
                        </div>
                      </GlowCard>
                    </div>

                    <GlowCard className="text-center bg-secondary/5 border-secondary/30">
                      <Heart className="w-8 h-8 text-secondary mx-auto mb-3" />
                      <h3 className="font-tech font-bold text-foreground mb-2">Community Donations</h3>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        Have working equipment you'd like to donate to schools or community makerspaces? 
                        We can help connect you with local programs. Just select "Donation" in the form below.
                      </p>
                    </GlowCard>
                  </motion.div>
                </TabsContent>

                {/* Filament Tab */}
                <TabsContent value="filament">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-tech font-bold text-foreground mb-2">Filament Buyback Program</h2>
                      <p className="text-muted-foreground">We buy partially-used spools in good condition</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <GlowCard variant="teal">
                        <h3 className="font-tech font-bold text-foreground mb-4 flex items-center gap-2">
                          <Package className="w-5 h-5 text-secondary" />
                          Requirements
                        </h3>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Labeled</span>
                              <p className="text-muted-foreground">Material type, brand, and color must be identifiable</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Stored Dry</span>
                              <p className="text-muted-foreground">Vacuum sealed or in dry box preferred</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">Clean & Untangled</span>
                              <p className="text-muted-foreground">No knots, debris, or contamination</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium text-foreground">25%+ Remaining</span>
                              <p className="text-muted-foreground">Minimum viable amount for resale</p>
                            </div>
                          </li>
                        </ul>
                      </GlowCard>

                      <GlowCard>
                        <h3 className="font-tech font-bold text-foreground mb-4 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-primary" />
                          Why We Do This
                        </h3>
                        <div className="space-y-4 text-sm text-muted-foreground">
                          <p>
                            Partially-used spools often get tossed or forgotten. By buying them back, 
                            we can offer affordable filament to the community while reducing waste.
                          </p>
                          <p>
                            We may perform spot-check drying and testing before resale. Premium brands 
                            and specialty materials (PETG-CF, TPU, etc.) command higher buyback rates.
                          </p>
                          <div className="p-3 rounded-lg bg-muted/30 border border-border">
                            <div className="font-medium text-foreground mb-1">Typical Buyback Rate</div>
                            <div className="text-lg font-tech font-bold text-secondary">
                              30-50% of retail value
                            </div>
                            <div className="text-xs">Based on remaining weight & condition</div>
                          </div>
                        </div>
                      </GlowCard>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Request Quote Form */}
          <section className="py-16 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <GlowCard variant="magenta" className="border-t-2 border-t-primary/50">
                  <div className="text-center mb-8">
                    <DollarSign className="w-10 h-10 text-primary mx-auto mb-3" />
                    <h2 className="text-2xl font-tech font-bold text-foreground mb-2">
                      Request a Buyback Quote
                    </h2>
                    <p className="text-muted-foreground">
                      Tell us what you have and we'll get back with an offer.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="item_type">Item Type *</Label>
                        <Select
                          value={formData.item_type}
                          onValueChange={(value) => setFormData({ ...formData, item_type: value as BuybackItemType })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="printer">3D Printer</SelectItem>
                            <SelectItem value="filament">Filament Spools</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="donation">Donation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="condition">Condition</Label>
                        <Select
                          value={formData.condition}
                          onValueChange={(value) => setFormData({ ...formData, condition: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition..." />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITIONS.map((c) => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand_model">Brand / Model</Label>
                      <Input
                        id="brand_model"
                        placeholder="e.g., Prusa MK3S+, Bambu P1S, eSUN PLA+"
                        value={formData.brand_model}
                        onChange={(e) => setFormData({ ...formData, brand_model: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Description / Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Tell us about the item's history, any issues, included accessories, etc."
                        rows={4}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photo_url">Photo URL (optional)</Label>
                      <Input
                        id="photo_url"
                        placeholder="Paste a link to photos (Imgur, Google Drive, etc.)"
                        value={formData.photo_url}
                        onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Photos help us provide more accurate quotes
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="Halifax, Toronto, etc."
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="province">Province</Label>
                        <Select
                          value={formData.province}
                          onValueChange={(value) => setFormData({ ...formData, province: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select province..." />
                          </SelectTrigger>
                          <SelectContent>
                            {PROVINCES.map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        required
                      />
                    </div>

                    {!user && (
                      <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong className="text-foreground">Want to track your quote?</strong>
                        </p>
                        <NeonButton
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/auth', { state: { returnTo: '/recycle-buyback' } })}
                        >
                          Create Free Account
                        </NeonButton>
                        <p className="text-xs text-muted-foreground mt-2">
                          Or submit below — we'll email your quote directly.
                        </p>
                      </div>
                    )}

                    <NeonButton
                      type="submit"
                      variant="secondary"
                      size="xl"
                      className="w-full"
                      icon={submitMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? 'Submitting...' : 'Submit Quote Request'}
                    </NeonButton>
                  </form>
                </GlowCard>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RecycleBuyback;
