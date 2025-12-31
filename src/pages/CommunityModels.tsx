import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlowCard } from '@/components/ui/GlowCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Upload, Download, Search, Grid, List, Star,
  Eye, Heart, Package, Filter, Plus, X, Coins, Award, Users
} from 'lucide-react';
import { formatCredits } from '@/config/credits';

const CommunityModels = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'my-models'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    category: '',
    price_credits: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Fetch approved community models
  const { data: models, isLoading: modelsLoading } = useQuery({
    queryKey: ['community_models', selectedCategory, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('creator_models')
        .select('*')
        .eq('is_approved', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch user's own models
  const { data: myModels, isLoading: myModelsLoading, refetch: refetchMyModels } = useQuery({
    queryKey: ['my_models', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('creator_models')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const handleUpload = async () => {
    if (!uploadForm.name.trim()) {
      toast({ title: "Error", description: "Please enter a model name", variant: "destructive" });
      return;
    }
    if (!uploadForm.category) {
      toast({ title: "Error", description: "Please select a category", variant: "destructive" });
      return;
    }

    try {
      const { error } = await supabase.from('creator_models').insert({
        creator_id: user?.id,
        name: uploadForm.name,
        description: uploadForm.description,
        category: uploadForm.category,
        price_credits: uploadForm.price_credits,
        is_approved: false,
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "Model Submitted!",
        description: "Your model is pending review. You'll earn 100 points when approved!",
      });
      
      setUploadForm({ name: '', description: '', category: '', price_credits: 0 });
      refetchMyModels();
      setActiveTab('my-models');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit model",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <AnimatedLogo size="lg" />
        </div>
      </div>
    );
  }

  const categories = [
    { id: 'all', label: 'All Models' },
    { id: 'figurines', label: 'Figurines' },
    { id: 'functional', label: 'Functional' },
    { id: 'gadgets', label: 'Gadgets' },
    { id: 'art', label: 'Art & Decor' },
    { id: 'toys', label: 'Toys & Games' },
    { id: 'cosplay', label: 'Cosplay' },
    { id: 'other', label: 'Other' },
  ];

  const stats = [
    { label: 'Models Shared', value: models?.length || 0, icon: Package },
    { label: 'Creators', value: 42, icon: Users },
    { label: 'Downloads', value: '1.2K', icon: Download },
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

        <main className="container mx-auto px-4 py-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-tech font-bold text-foreground mb-2">
              Community Models
            </h1>
            <p className="text-muted-foreground mb-6">
              Share your designs, discover new prints, earn credits
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <stat.icon className="w-5 h-5 text-secondary" />
                    <span className="text-2xl font-tech font-bold text-foreground">{stat.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(['browse', 'upload', 'my-models'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab 
                    ? 'bg-secondary text-secondary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab === 'browse' && <><Grid className="w-4 h-4" /> Browse</>}
                {tab === 'upload' && <><Upload className="w-4 h-4" /> Upload</>}
                {tab === 'my-models' && <><Package className="w-4 h-4" /> My Models</>}
              </button>
            ))}
          </div>

          {/* Browse Tab */}
          {activeTab === 'browse' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Search & Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search models..."
                    className="pl-10 bg-input border-border"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        selectedCategory === cat.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models Grid */}
              {modelsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : models && models.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {models.map((model: any, index: number) => (
                    <motion.div
                      key={model.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlowCard className="overflow-hidden group cursor-pointer">
                        <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                          {model.thumbnail_url ? (
                            <img 
                              src={model.thumbnail_url} 
                              alt={model.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-12 h-12 text-muted-foreground" />
                          )}
                          <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <button className="p-3 rounded-full bg-secondary text-secondary-foreground">
                              <Eye className="w-5 h-5" />
                            </button>
                            <button className="p-3 rounded-full bg-primary text-primary-foreground">
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-medium text-foreground truncate">{model.name}</h4>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Download className="w-4 h-4" />
                              {model.download_count || 0}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-secondary font-medium">
                              <Coins className="w-4 h-4" />
                              {model.price_credits || 'Free'}
                            </div>
                          </div>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No models found</h3>
                  <p className="text-muted-foreground mb-4">Be the first to share a model!</p>
                  <NeonButton onClick={() => setActiveTab('upload')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Model
                  </NeonButton>
                </div>
              )}
            </motion.div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="max-w-2xl mx-auto">
                <GlowCard className="p-6 mb-6 bg-success/5 border-success/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-success/20">
                      <Award className="w-8 h-8 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Earn 100 Points!</h3>
                      <p className="text-sm text-muted-foreground">
                        Get rewarded when your model is approved. Plus earn credits each time someone prints it!
                      </p>
                    </div>
                  </div>
                </GlowCard>

                <GlowCard className="p-8">
                  <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-secondary" />
                    Submit Your Model
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-foreground">Model Name *</Label>
                      <Input
                        id="name"
                        value={uploadForm.name}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Low-Poly Cat Figurine"
                        className="bg-input border-border"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-foreground">Description</Label>
                      <Textarea
                        id="description"
                        value={uploadForm.description}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your model, print settings, etc."
                        className="bg-input border-border min-h-[100px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-foreground">Category *</Label>
                      <select
                        id="category"
                        value={uploadForm.category}
                        onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground"
                      >
                        <option value="">Select a category...</option>
                        {categories.filter(c => c.id !== 'all').map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="price" className="text-foreground">Price (Credits)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          value={uploadForm.price_credits}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, price_credits: parseInt(e.target.value) || 0 }))}
                          placeholder="0 for free"
                          className="bg-input border-border max-w-[150px]"
                        />
                        <span className="text-sm text-muted-foreground">
                          {uploadForm.price_credits === 0 ? 'Free for everyone!' : `You earn ${formatCredits(Math.floor(uploadForm.price_credits * 0.8))} per download`}
                        </span>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-secondary transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-foreground font-medium">Drop your .STL file here</p>
                      <p className="text-sm text-muted-foreground mt-1">or click to browse (max 50MB)</p>
                      <p className="text-xs text-muted-foreground mt-2">File upload coming soon - submit details now!</p>
                    </div>

                    <NeonButton onClick={handleUpload} className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Submit for Review
                    </NeonButton>
                  </div>
                </GlowCard>
              </div>
            </motion.div>
          )}

          {/* My Models Tab */}
          {activeTab === 'my-models' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {myModelsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : myModels && myModels.length > 0 ? (
                <div className="space-y-4">
                  {myModels.map((model: any) => (
                    <GlowCard key={model.id} className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                          {model.thumbnail_url ? (
                            <img src={model.thumbnail_url} alt={model.name} className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <Package className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{model.name}</h4>
                          <p className="text-sm text-muted-foreground truncate">{model.description || 'No description'}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              model.is_approved 
                                ? 'bg-success/20 text-success' 
                                : 'bg-warning/20 text-warning'
                            }`}>
                              {model.is_approved ? 'Approved' : 'Pending Review'}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Download className="w-3 h-3" /> {model.download_count || 0} downloads
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Coins className="w-3 h-3" /> {model.total_earnings_credits || 0} earned
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No models yet</h3>
                  <p className="text-muted-foreground mb-4">Share your first design with the community!</p>
                  <NeonButton onClick={() => setActiveTab('upload')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Model
                  </NeonButton>
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CommunityModels;
