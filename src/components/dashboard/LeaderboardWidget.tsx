
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  profit: number;
  profitPercentage: number;
  position: number;
}

const LeaderboardWidget = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Calculate profitability
    const startingBalance = 100000; // Starting balance for all users
    
    const leaderboardUsers = users.map((u: any) => {
      const profit = u.balance - startingBalance;
      const profitPercentage = (profit / startingBalance) * 100;
      
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        balance: u.balance,
        profit,
        profitPercentage,
        position: 0,
      };
    });
    
    // Sort by profit percentage
    const sortedUsers = leaderboardUsers.sort((a: LeaderboardUser, b: LeaderboardUser) => 
      b.profitPercentage - a.profitPercentage
    );
    
    // Assign positions
    const rankedUsers = sortedUsers.map((u: LeaderboardUser, index: number) => ({
      ...u,
      position: index + 1,
    })).slice(0, 5); // Only take top 5
    
    setLeaderboardData(rankedUsers);
  }, []);

  const handleViewAll = () => {
    navigate('/leaderboard');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>Top performers this month</CardDescription>
          </div>
          <button 
            onClick={handleViewAll}
            className="text-xs text-stalkx-500 hover:underline"
          >
            View All
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.length > 0 ? (
            leaderboardData.map((user) => (
              <div 
                key={user.id}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  user.position === 1 ? "bg-yellow-100 text-yellow-800" : 
                  user.position === 2 ? "bg-gray-100 text-gray-800" : 
                  user.position === 3 ? "bg-amber-100 text-amber-800" : 
                  "bg-muted text-muted-foreground"
                )}>
                  {user.position}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {user.profitPercentage.toFixed(2)}% ROI
                  </div>
                </div>
                <div className="text-right font-semibold text-emerald-600">
                  <div className="flex items-center justify-end">
                    <IndianRupee className="mr-0.5 h-3 w-3" />
                    {user.profit.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No investors found yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
