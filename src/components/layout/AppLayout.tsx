import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Settings, LogOut, CreditCard, Gift } from 'lucide-react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { signOut } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard/customer', icon: Home },
    { name: 'Subscription', path: '/dashboard/subscription', icon: CreditCard },
    { name: 'Rewards', path: '/dashboard/rewards', icon: Gift },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-neutral-light">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-neutral-xlight font-display">3d3d.ca</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-lg rounded-lg transition-colors ${
                isActive ? 'bg-primary/20 text-primary' : 'hover:bg-neutral-dark'
              }`
            }
          >
            <item.icon className="w-6 h-6 mr-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start text-lg" onClick={signOut}>
          <LogOut className="w-6 h-6 mr-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 p-4">
        <div className="h-full glass-card">
          <SidebarContent />
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="lg:hidden h-20 p-4">
          <div className="h-full glass-card flex items-center justify-between px-6">
            <h1 className="text-2xl font-bold text-neutral-xlight font-display">3d3d.ca</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-8 h-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-neutral-dark/80 backdrop-blur-xl border-r border-border p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* PulZ Assistant mount point */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
