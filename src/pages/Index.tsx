
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TopGainersLosers from '@/components/dashboard/TopGainersLosers';
import NewsWidget from '@/components/dashboard/NewsWidget';
import { useAuth } from '@/contexts/AuthContext';
import { useStocks } from '@/contexts/StockContext';
import UserPortfolio from '@/components/dashboard/UserPortfolio';
import LeaderboardWidget from '@/components/dashboard/LeaderboardWidget';
import { Wallet, TrendingUp, IndianRupee } from 'lucide-react';
import Logo from '@/components/Logo';

const Dashboard = () => {
  const { user } = useAuth();
  const { stocks } = useStocks();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [totalProfit, setTotalProfit] = useState(0);

  useEffect(() => {
    // Get user portfolio from localStorage
    const userPortfolio = JSON.parse(localStorage.getItem(`portfolio_${user?.id}`) || '[]');
    setPortfolio(userPortfolio);
    
    // Calculate total profit
    const initialInvestment = 100000 - (user?.balance || 0);
    const currentValue = userPortfolio.reduce((total: number, item: any) => {
      const stock = stocks.find(s => s.id === item.stockId);
      return total + (stock ? stock.price * item.quantity : 0);
    }, 0);
    
    const profit = currentValue - initialInvestment;
    setTotalProfit(profit);
  }, [user, stocks]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome to StalkX. Track your portfolio and market trends.</p>
        </div>
        <div className="hidden md:block">
          <Logo />
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{user?.balance?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="animate-scale-in animation-delay-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invested Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(100000 - (user?.balance || 0)).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Initial deposit: ₹100,000
            </p>
          </CardContent>
        </Card>
        
        <Card className="animate-scale-in animation-delay-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
            <TrendingUp className={`h-4 w-4 ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}₹{Math.abs(totalProfit).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              ROI: {((totalProfit / (100000 - (user?.balance || 0))) * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UserPortfolio />
          <TopGainersLosers />
        </div>
        <div className="space-y-6">
          <NewsWidget />
          <LeaderboardWidget />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
