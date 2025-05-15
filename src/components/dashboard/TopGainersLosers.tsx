
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useStocks } from '@/contexts/StockContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

const TopGainersLosers = () => {
  const { stocks } = useStocks();
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('gainers');

  useEffect(() => {
    // Sort stocks by percentage change
    const sortedStocks = [...stocks];
    
    // Get top 5 gainers (highest positive change)
    const gainers = sortedStocks
      .filter(stock => stock.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 5);
    
    // Get top 5 losers (highest negative change)
    const losers = sortedStocks
      .filter(stock => stock.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 5);
    
    setTopGainers(gainers);
    setTopLosers(losers);
  }, [stocks]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Market Movers</CardTitle>
          <CardDescription>Today's biggest stock movements</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="gainers" 
              className="flex items-center gap-1"
            >
              <TrendingUp className="h-3 w-3 text-emerald-500" /> Gainers
            </TabsTrigger>
            <TabsTrigger 
              value="losers" 
              className="flex items-center gap-1"
            >
              <TrendingDown className="h-3 w-3 text-red-500" /> Losers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers" className="mt-0 pt-2">
            <div className="space-y-2">
              {topGainers.length > 0 ? (
                topGainers.map((stock) => (
                  <Link 
                    to={`/stock/${stock.symbol}`}
                    key={stock.id}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-accent/40 transition-colors">
                      <div className="font-medium">{stock.name} ({stock.symbol})</div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant="outline" 
                          className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs"
                        >
                          Top Gainer
                        </Badge>
                        <div className="flex w-28 flex-col text-right">
                          <div className="flex items-center justify-end gap-1 font-medium">
                            <IndianRupee className="h-3 w-3" />
                            {stock.price.toFixed(2)}
                          </div>
                          <div className="text-xs flex items-center justify-end text-emerald-600">
                            <ArrowUp className="mr-1 h-3 w-3" />
                            {stock.change.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No gainers found today.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="losers" className="mt-0 pt-2">
            <div className="space-y-2">
              {topLosers.length > 0 ? (
                topLosers.map((stock) => (
                  <Link 
                    to={`/stock/${stock.symbol}`}
                    key={stock.id}
                    className="block"
                  >
                    <div className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-accent/40 transition-colors">
                      <div className="font-medium">{stock.name} ({stock.symbol})</div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant="outline" 
                          className="bg-red-50 text-red-600 border-red-200 text-xs"
                        >
                          Top Loser
                        </Badge>
                        <div className="flex w-28 flex-col text-right">
                          <div className="flex items-center justify-end gap-1 font-medium">
                            <IndianRupee className="h-3 w-3" />
                            {stock.price.toFixed(2)}
                          </div>
                          <div className="text-xs flex items-center justify-end text-red-600">
                            <ArrowDown className="mr-1 h-3 w-3" />
                            {Math.abs(stock.change).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No losers found today.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TopGainersLosers;
