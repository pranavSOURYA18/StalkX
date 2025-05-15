
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  profit: number;
  profitPercentage: number;
  rank: number;
}

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

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
        rank: 0,
      };
    });
    
    // Sort by profit percentage
    const sortedUsers = leaderboardUsers.sort((a: LeaderboardUser, b: LeaderboardUser) => 
      b.profitPercentage - a.profitPercentage
    );
    
    // Assign ranks
    const rankedUsers = sortedUsers.map((u: LeaderboardUser, index: number) => ({
      ...u,
      rank: index + 1,
    }));
    
    setLeaderboardData(rankedUsers);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
        <p className="text-muted-foreground">See how you rank among other investors</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Investors</CardTitle>
          <CardDescription>Based on profit percentage</CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboardData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Investor</TableHead>
                  <TableHead className="text-right">Total Profit</TableHead>
                  <TableHead className="text-right">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((userData) => (
                  <TableRow key={userData.id} className={cn(
                    userData.id === user?.id && "bg-muted/50"
                  )}>
                    <TableCell className="font-medium">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                        userData.rank === 1 ? "bg-yellow-100 text-yellow-800" : 
                        userData.rank === 2 ? "bg-gray-100 text-gray-800" : 
                        userData.rank === 3 ? "bg-amber-100 text-amber-800" : 
                        "bg-muted text-muted-foreground"
                      )}>
                        {userData.rank}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userData.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {userData.id === user?.id ? "You" : userData.email.split('@')[0]}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-semibold",
                      userData.profit >= 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      <div className="flex items-center justify-end gap-0.5">
                        <IndianRupee className="h-3 w-3" />
                        <span>{userData.profit.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-semibold",
                      userData.profitPercentage >= 0 ? "text-emerald-600" : "text-red-600"
                    )}>
                      {userData.profitPercentage.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No investors found. Be the first to start investing!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
