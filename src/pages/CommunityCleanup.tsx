import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { usePointWallet } from '@/hooks/useUserData';
import { GlowCard } from '@/components/ui/GlowCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  TreePine, Camera, MapPin, Trash2, Award, Users, 
  Flame, Trophy, Star, Upload, Calendar, Check,
  Mountain, Waves, Building, Leaf
} from 'lucide-react';

const CommunityCleanup = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { data: pointWallet } = usePointWallet();
  
  const [activeTab, setActiveTab] = useState<'submit' | 'leaderboard' | 'events'>('submit');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    location: '',
    description: '',
    bagsCollected: '1',
    category: 'park'
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async () => {
    if (!form.location.trim()) {
      toast({ title: "Error", description: "Please enter the cleanup location", variant: "destructive" });
      return;
    }
    if (!form.description.trim()) {
      toast({ title: "Error", description: "Please describe what you cleaned up", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate submission - would connect to backend
    setTimeout(() => {
      const bags = parseInt(form.bagsCollected) || 1;
      const pointsEarned = bags * 100;
      
      toast({
        title: "Cleanup Submitted! 🌍",
        description: `Thank you for making your community cleaner! You'll earn ${pointsEarned} points once verified.`,
      });
      
      setForm({ location: '', description: '', bagsCollected: '1', category: 'park' });
      setSubmitting(false);
    }, 1500);
  };

  const cleanupCategories = [
    { id: 'park', label: 'Park', icon: TreePine },
    { id: 'beach', label: 'Beach/River', icon: Waves },
    { id: 'trail', label: 'Trail/Forest', icon: Mountain },
    { id: 'urban', label: 'Street/Urban', icon: Building },
    { id: 'other', label: 'Other', icon: Leaf },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Spring River Cleanup 2025",
      date: "March 22, 2025",
      location: "Bow River, Calgary",
      participants: 45,
      reward: "500 points + exclusive badge",
      image: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400"
    },
    {
      id: 2,
      title: "Earth Day Community Clean",
      date: "April 22, 2025",
      location: "Multiple Locations",
      participants: 120,
      reward: "1000 points + free print",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400"
    },
    {
      id: 3,
      title: "Beach Patrol Weekend",
      date: "May 15-16, 2025",
      location: "Vancouver Island",
      participants: 28,
      reward: "750 points per day",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "EcoWarrior_Alex", bags: 156, points: 15600, badge: "🏆" },
    { rank: 2, name: "GreenHero22", bags: 142, points: 14200, badge: "🥈" },
    { rank: 3, name: "CleanTeamLead", bags: 128, points: 12800, badge: "🥉" },
    { rank: 4, name: "NatureFirst", bags: 98, points: 9800, badge: "⭐" },
    { rank: 5, name: "TrailBlazer", bags: 87, points: 8700, badge: "⭐" },
  ];

  const milestones = [
    { bags: 5, reward: "Eco Starter Badge", points: 50 },
    { bags: 25, reward: "Community Hero", points: 250 },
    { bags: 50, reward: "Green Guardian", points: 500 },
    { bags: 100, reward: "Environmental Champion", points: 1000 },
    { bags: 250, reward: "Legendary Cleaner", points: 2500 },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/20 mb-6 relative">
          <TreePine className="w-12 h-12 text-success" />
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-3">
          Community Cleanup
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Clean up your community, earn points, get free 3D prints! 
          Every bag of trash collected earns you <span className="text-success font-bold">100 points</span>.
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <GlowCard className="p-4 text-center" variant="teal">
          <Trash2 className="w-6 h-6 text-success mx-auto mb-2" />
          <div className="text-2xl font-tech font-bold text-foreground">2,847</div>
          <div className="text-xs text-muted-foreground">Bags Collected</div>
        </GlowCard>
        <GlowCard className="p-4 text-center" variant="magenta">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-tech font-bold text-foreground">312</div>
          <div className="text-xs text-muted-foreground">Active Cleaners</div>
        </GlowCard>
        <GlowCard className="p-4 text-center">
          <MapPin className="w-6 h-6 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-tech font-bold text-foreground">156</div>
          <div className="text-xs text-muted-foreground">Locations Cleaned</div>
        </GlowCard>
        <GlowCard className="p-4 text-center">
          <Award className="w-6 h-6 text-warning mx-auto mb-2" />
          <div className="text-2xl font-tech font-bold text-foreground">284,700</div>
          <div className="text-xs text-muted-foreground">Points Awarded</div>
        </GlowCard>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['submit', 'events', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-success text-background' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {tab === 'submit' && 'Submit Cleanup'}
            {tab === 'events' && 'Upcoming Events'}
            {tab === 'leaderboard' && 'Leaderboard'}
          </button>
        ))}
      </div>

      {/* Submit Cleanup Tab */}
      {activeTab === 'submit' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Submission Form */}
          <GlowCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-secondary" />
              Log Your Cleanup
            </h3>

            <div className="space-y-5">
              {/* Category Selection */}
              <div>
                <Label className="text-foreground mb-2 block">Cleanup Type</Label>
                <div className="grid grid-cols-5 gap-2">
                  {cleanupCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setForm(prev => ({ ...prev, category: cat.id }))}
                      className={`p-3 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                        form.category === cat.id
                          ? 'border-success bg-success/20 text-success'
                          : 'border-border bg-muted/50 text-muted-foreground hover:border-success/50'
                      }`}
                    >
                      <cat.icon className="w-5 h-5" />
                      <span className="text-xs">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-foreground">Location *</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., Nose Hill Park, Calgary"
                    className="pl-10 bg-input border-border"
                  />
                </div>
              </div>

              {/* Bags Collected */}
              <div>
                <Label htmlFor="bags" className="text-foreground">Bags of Trash Collected *</Label>
                <div className="flex items-center gap-3 mt-1">
                  <Input
                    id="bags"
                    type="number"
                    min="1"
                    max="99"
                    value={form.bagsCollected}
                    onChange={(e) => setForm(prev => ({ ...prev, bagsCollected: e.target.value }))}
                    className="w-24 bg-input border-border text-center"
                  />
                  <span className="text-sm text-muted-foreground">
                    = <span className="text-success font-bold">{(parseInt(form.bagsCollected) || 0) * 100} points</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-foreground">What did you clean up? *</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the trash you collected (e.g., plastic bottles, cigarette butts, food wrappers...)"
                  className="mt-1 bg-input border-border min-h-[100px]"
                />
              </div>

              {/* Photo Upload Placeholder */}
              <div>
                <Label className="text-foreground">Photo Evidence (Optional)</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-success/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload before/after photos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Photos increase verification speed!
                  </p>
                </div>
              </div>

              <NeonButton onClick={handleSubmit} disabled={submitting} className="w-full">
                {submitting ? 'Submitting...' : 'Submit Cleanup 🌍'}
              </NeonButton>
            </div>
          </GlowCard>

          {/* Milestones & Rewards */}
          <div className="space-y-6">
            <GlowCard className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Milestones & Rewards
              </h3>
              
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                        <Star className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{milestone.reward}</div>
                        <div className="text-xs text-muted-foreground">{milestone.bags} bags collected</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-success">+{milestone.points}</div>
                  </div>
                ))}
              </div>
            </GlowCard>

            <GlowCard className="p-6 bg-success/5 border-success/20">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-success/20">
                  <Flame className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Earn Free 3D Prints!</h4>
                  <p className="text-sm text-muted-foreground">
                    Redeem your cleanup points for free 3D prints. 500 points = 1 small print credit. 
                    Help the environment AND get cool stuff!
                  </p>
                </div>
              </div>
            </GlowCard>
          </div>
        </motion.div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlowCard className="overflow-hidden">
                <div className="relative h-40">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-foreground">{event.title}</h3>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {event.participants} participants
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">Reward:</div>
                    <div className="text-sm font-medium text-success">{event.reward}</div>
                  </div>
                  <NeonButton variant="secondary" className="w-full">
                    Join Event
                  </NeonButton>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <GlowCard className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              Top Community Cleaners
            </h3>
            
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    entry.rank <= 3 
                      ? 'bg-warning/10 border-warning/30' 
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{entry.badge}</div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold">
                      #{entry.rank}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{entry.name}</div>
                      <div className="text-sm text-muted-foreground">{entry.bags} bags collected</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-tech font-bold text-success">{entry.points.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-secondary/10 border border-secondary/30 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your current rank</p>
              <div className="text-2xl font-tech font-bold text-foreground">#127</div>
              <p className="text-xs text-muted-foreground">Keep cleaning to climb the leaderboard!</p>
            </div>
          </GlowCard>
        </motion.div>
      )}
    </div>
  );
};

export default CommunityCleanup;
