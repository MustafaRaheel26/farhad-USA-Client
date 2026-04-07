import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ChefHat, 
  CheckCircle2, 
  Bell, 
  Settings, 
  Search, 
  Moon, 
  Sun, 
  UtensilsCrossed,
  Clock,
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { Toaster } from 'sonner';

import { useOrders } from '@/hooks/useOrders';
import { OrderCard } from '@/components/dashboard/OrderCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ChefPanel } from '@/components/dashboard/ChefPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function App() {
  const {
    orders,
    isAutoGenerating,
    setIsAutoGenerating,
    handleStatusChange,
    generateNewOrder,
    stats
  } = useOrders();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'preparing' | 'ready'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'orders' | 'chef'>('orders');
  
  // Initialize dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-sans selection:bg-primary/20">
      <Toaster position="top-right" richColors closeButton />
      
      {/* Sidebar - Hidden on mobile, rail on desktop */}
      <aside className="fixed left-0 top-0 h-full w-16 md:w-20 border-r border-border/50 bg-card/50 backdrop-blur-xl z-50 flex flex-col items-center py-6 gap-8">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <UtensilsCrossed className="w-6 h-6 text-primary-foreground" />
        </div>
        
        <nav className="flex flex-col gap-4 flex-grow">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-300",
              currentView === 'orders' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"
            )}
            onClick={() => setCurrentView('orders')}
          >
            <LayoutDashboard className="w-6 h-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "w-12 h-12 rounded-xl transition-all duration-300",
              currentView === 'chef' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"
            )}
            onClick={() => setCurrentView('chef')}
          >
            <ChefHat className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl text-muted-foreground hover:text-primary">
            <CheckCircle2 className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl text-muted-foreground hover:text-primary">
            <Settings className="w-6 h-6" />
          </Button>
        </nav>

        <div className="flex flex-col gap-4 items-center">
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 rounded-xl text-muted-foreground hover:text-primary"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </Button>
          </div>
          <div className="w-8 h-8 rounded-full bg-muted border border-border overflow-hidden">
            <img 
              src="https://picsum.photos/seed/chef/100/100" 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-16 md:pl-20 min-h-screen flex flex-col">
        {currentView === 'orders' ? (
          <>
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Kitchen Dashboard</h1>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Live Updates Active • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="relative flex items-center justify-center">
                  <div id="notification-ping" className="absolute w-3 h-3 bg-blue-500 rounded-full opacity-0"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search orders, tables..." 
                    className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button onClick={generateNewOrder} className="hidden md:flex gap-2">
                  <Plus className="w-4 h-4" />
                  Test Order
                </Button>
              </div>
            </header>

            {/* Dashboard Content */}
            <ScrollArea className="flex-grow">
              <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatsCard 
                    title="Total Orders" 
                    value={stats.total} 
                    icon={LayoutDashboard} 
                    trend="+12% from yesterday"
                    trendType="up"
                  />
                  <StatsCard 
                    title="New Orders" 
                    value={stats.new} 
                    icon={Bell} 
                    trend={stats.new > 3 ? "High volume" : "Normal"}
                    trendType={stats.new > 3 ? "down" : "neutral"}
                    className={stats.new > 0 ? "border-blue-500/50 bg-blue-500/5" : ""}
                  />
                  <StatsCard 
                    title="Preparing" 
                    value={stats.preparing} 
                    icon={ChefHat} 
                    trend="Avg. 12m prep time"
                    trendType="neutral"
                  />
                  <StatsCard 
                    title="Ready" 
                    value={stats.ready} 
                    icon={CheckCircle2} 
                    trend="98% on-time delivery"
                    trendType="up"
                  />
                </div>

                {/* Controls & Filters */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full md:w-auto">
                    <TabsList className="bg-muted/50 p-1">
                      <TabsTrigger value="all" className="px-6">All</TabsTrigger>
                      <TabsTrigger value="new" className="px-6 flex gap-2">
                        New
                        {stats.new > 0 && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white font-bold">
                            {stats.new}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="preparing" className="px-6">Preparing</TabsTrigger>
                      <TabsTrigger value="ready" className="px-6">Ready</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <div className="flex items-center gap-6 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Auto-Refresh</span>
                      <Switch 
                        checked={isAutoGenerating} 
                        onCheckedChange={setIsAutoGenerating}
                      />
                    </div>
                    <div className="h-4 w-[1px] bg-border"></div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Sound Alerts</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <OrderCard 
                          key={order.id} 
                          order={order} 
                          onStatusChange={handleStatusChange} 
                        />
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                      >
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No orders found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                          Try adjusting your filters or search query to find what you're looking for.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </ScrollArea>
          </>
        ) : (
          <ScrollArea className="flex-grow">
            <ChefPanel />
          </ScrollArea>
        )}

        {/* Footer Stats - Desktop Only */}
        <footer className="hidden md:flex items-center justify-between px-6 py-3 border-t border-border/50 bg-card/30 backdrop-blur-sm text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Peak Hour: 19:00 - 21:00
            </span>
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              Staff: 12 Active
            </span>
          </div>
          <div>
            ChefStream v1.0.4 • System Operational
          </div>
        </footer>
      </main>
    </div>
  );
}
