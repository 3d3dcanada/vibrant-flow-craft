import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAchievements, useUserAchievements } from '@/hooks/useUserData';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { GlowCard } from '@/components/ui/GlowCard';
import { 
  Trophy, ArrowLeft, Printer, Recycle, Users, Share2, 
  Box, Heart, Flame, Crown, Lock, Sparkles
} from 'lucide-react';

const iconMap: Record<string, any> = {
  printer: Printer,
  recycle: Recycle,
  users: Users,
  share: Share2,
  box: Box,
  heart: Heart,
  flame: Flame,
  crown: Crown
};

const Achievements = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: achievements } = useAchievements();
  const { data: userAchievements } = useUserAchievements();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const unlockedIds = new Set(userAchievements?.map((ua: any) => ua.achievement_id) || []);

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-primary/10 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/">
              <AnimatedLogo size="sm" />
            </Link>
            
            <Link to="/dashboard">
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-yellow-500/20 mb-6">
              <Trophy className="w-10 h-10 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-tech font-bold text-foreground mb-4">
              Achievements
            </h1>
            <p className="text-xl text-muted-foreground">
              <span className="text-secondary font-semibold">{userAchievements?.length || 0}</span> of{' '}
              <span className="font-semibold">{achievements?.length || 0}</span> unlocked
            </p>
          </motion.div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {achievements?.map((achievement: any, index: number) => {
              const isUnlocked = unlockedIds.has(achievement.id);
              const Icon = iconMap[achievement.icon] || Trophy;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlowCard 
                    className={`p-6 h-full transition-all ${
                      isUnlocked 
                        ? 'border-yellow-500/50 bg-yellow-500/5' 
                        : 'opacity-60 grayscale'
                    }`}
                    glowColor={isUnlocked ? 'secondary' : undefined}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        isUnlocked 
                          ? 'bg-yellow-500/20' 
                          : 'bg-muted/20'
                      }`}>
                        {isUnlocked ? (
                          <Icon className="w-8 h-8 text-yellow-500" />
                        ) : (
                          <Lock className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {achievement.name}
                          </h3>
                          {isUnlocked && (
                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">
                              Unlocked
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        <div className="flex items-center gap-1 mt-3 text-secondary">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm font-semibold">+{achievement.points_reward} points</span>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Achievements;
