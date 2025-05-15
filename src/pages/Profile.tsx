
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useStocks } from '@/contexts/StockContext';
import { formatDistance } from 'date-fns';
import { ArrowDown, ArrowUp, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { user } = useAuth();
  const { portfolio, transactions } = useStocks();
  const [activeTab, setActiveTab] = useState('portfolio');

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  // Calculate total portfolio value
  const portfolioValue = portfolio.reduce(
    (total, item) => total + item.quantity * item.currentPrice,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="mt-2 flex gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                {user.balance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                {portfolioValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="portfolio" className="flex-1">Portfolio</TabsTrigger>
          <TabsTrigger value="transactions" className="flex-1">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Portfolio</CardTitle>
              <CardDescription>Current holdings</CardDescription>
            </CardHeader>
            <CardContent>
              {portfolio.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Avg. Price</TableHead>
                      <TableHead className="text-right">Current Price</TableHead>
                      <TableHead className="text-right">Total Value</TableHead>
                      <TableHead className="text-right">Profit/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.map((stock) => {
                      const profitLoss = (stock.currentPrice - stock.avgPrice) * stock.quantity;
                      const profitLossPercentage = ((stock.currentPrice / stock.avgPrice) - 1) * 100;
                      
                      return (
                        <TableRow key={stock.stockId}>
                          <TableCell className="font-medium">
                            <div>
                              <div>{stock.name}</div>
                              <div className="text-xs text-muted-foreground">{stock.symbol}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {stock.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <IndianRupee className="h-3 w-3" />
                              <span>{stock.avgPrice.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <IndianRupee className="h-3 w-3" />
                              <span>{stock.currentPrice.toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <IndianRupee className="h-3 w-3" />
                              <span>{(stock.quantity * stock.currentPrice).toFixed(2)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className={cn(
                              "flex items-center justify-end gap-1",
                              profitLoss > 0 ? "text-emerald-600" : "text-red-600"
                            )}>
                              <IndianRupee className="h-3 w-3" />
                              <span>{profitLoss.toFixed(2)}</span>
                              <span className="text-xs">({profitLossPercentage.toFixed(2)}%)</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>You don't have any stocks in your portfolio</p>
                  <p className="text-sm mt-1">Start investing to build your portfolio</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Your past trades</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className={cn(
                            "flex items-center gap-1",
                            transaction.type === 'buy' ? "text-emerald-600" : "text-red-600"
                          )}>
                            {transaction.type === 'buy' ? (
                              <ArrowDown className="h-4 w-4" />
                            ) : (
                              <ArrowUp className="h-4 w-4" />
                            )}
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>
                            <div>{transaction.name}</div>
                            <div className="text-xs text-muted-foreground">{transaction.symbol}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {transaction.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IndianRupee className="h-3 w-3" />
                            <span>{transaction.price.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <IndianRupee className="h-3 w-3" />
                            <span>{transaction.total.toFixed(2)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm">
                          {formatDistance(new Date(transaction.date), new Date(), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>You haven't made any transactions yet</p>
                  <p className="text-sm mt-1">Buy or sell stocks to see your transaction history</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
