
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStocks } from '@/contexts/StockContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IndianRupee, ArrowUp, ArrowDown, Bookmark, BarChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const StockDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { 
    stocks, 
    addToWishlist, 
    removeFromWishlist, 
    isInWishlist,
    buyStock,
    sellStock,
    portfolio,
    getHistoricalData
  } = useStocks();
  const { user } = useAuth();
  
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [timeframe, setTimeframe] = useState<'day' | 'month' | 'year'>('month');
  
  const stock = stocks.find(s => s.symbol === symbol);
  
  if (!stock) {
    return <div className="p-8 text-center">Stock not found</div>;
  }
  
  // Calculate shares owned
  const ownedStock = portfolio.find(p => p.stockId === stock.id);
  const sharesOwned = ownedStock?.quantity || 0;
  
  // Toggle wishlist
  const toggleWishlist = () => {
    if (isInWishlist(stock.id)) {
      removeFromWishlist(stock.id);
    } else {
      addToWishlist(stock.id);
    }
  };
  
  const handleBuy = () => {
    if (buyQuantity <= 0) return;
    buyStock(stock, buyQuantity);
    setBuyQuantity(1);
  };
  
  const handleSell = () => {
    if (sellQuantity <= 0 || sellQuantity > sharesOwned) return;
    sellStock(stock, sellQuantity);
    setSellQuantity(1);
  };
  
  const chartData = getHistoricalData(stock.symbol, timeframe);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Explore
            </Link>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mt-2">{stock.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-lg font-semibold">{stock.symbol}</span>
            <div className={cn(
              "text-sm flex items-center gap-1",
              stock.change > 0 ? "text-emerald-600" : "text-red-600"
            )}>
              {stock.change > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(stock.change)}%
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={toggleWishlist}
        >
          <Bookmark 
            className={cn("h-5 w-5", 
              isInWishlist(stock.id) 
                ? "fill-stalkx-500 text-stalkx-500" 
                : "text-muted-foreground"
            )} 
          />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <IndianRupee className="h-5 w-5" />
                  {stock.price.toFixed(2)}
                </CardTitle>
                <CardDescription>Last updated: {format(new Date(), 'dd MMM yyyy, h:mm a')}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setTimeframe('day')}>Today</Button>
                <Button variant={timeframe === 'month' ? 'default' : 'outline'} size="sm" onClick={() => setTimeframe('month')}>1M</Button>
                <Button variant="outline" size="sm" onClick={() => setTimeframe('year')}>1Y</Button>
              </div>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1087ed" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1087ed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => `₹${value.toFixed(0)}`}
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toFixed(2)}`, 'Price']} 
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#1087ed" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Market Cap</h4>
                  <p className="text-lg flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {(stock.marketCap/1000).toFixed(0)}K Cr
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Volume</h4>
                  <p className="text-lg">{stock.volume.toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">52-Week High</h4>
                  <p className="text-lg flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {(stock.price * 1.2).toFixed(2)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">52-Week Low</h4>
                  <p className="text-lg flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {(stock.price * 0.8).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">About {stock.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {stock.name} is a leading company in its sector with strong market presence. 
                  The company has shown consistent growth over the years and continues to innovate in its field.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trade {stock.symbol}</CardTitle>
              <CardDescription>Buy or sell shares</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buy">
                <TabsList className="w-full">
                  <TabsTrigger value="buy" className="flex-1">Buy</TabsTrigger>
                  <TabsTrigger value="sell" className="flex-1" disabled={sharesOwned === 0}>Sell</TabsTrigger>
                </TabsList>
                
                <TabsContent value="buy" className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="buy-quantity">Quantity</Label>
                    <Input 
                      id="buy-quantity" 
                      type="number" 
                      min="1" 
                      value={buyQuantity} 
                      onChange={(e) => setBuyQuantity(parseInt(e.target.value) || 0)} 
                    />
                  </div>
                  
                  <div className="border rounded-md p-3 space-y-2 bg-muted/20">
                    <div className="flex justify-between text-sm">
                      <span>Price per share</span>
                      <span className="font-medium flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {stock.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total cost</span>
                      <span className="font-medium flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {(stock.price * buyQuantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span>Available balance</span>
                    <span className="font-medium flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {user?.balance.toLocaleString()}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleBuy}
                    disabled={!buyQuantity || (user?.balance || 0) < stock.price * buyQuantity}
                  >
                    Buy {buyQuantity} share{buyQuantity !== 1 ? 's' : ''}
                  </Button>
                </TabsContent>
                
                <TabsContent value="sell" className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="sell-quantity">Quantity (max: {sharesOwned})</Label>
                    <Input 
                      id="sell-quantity" 
                      type="number" 
                      min="1" 
                      max={sharesOwned} 
                      value={sellQuantity} 
                      onChange={(e) => setSellQuantity(parseInt(e.target.value) || 0)} 
                    />
                  </div>
                  
                  <div className="border rounded-md p-3 space-y-2 bg-muted/20">
                    <div className="flex justify-between text-sm">
                      <span>Price per share</span>
                      <span className="font-medium flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {stock.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total value</span>
                      <span className="font-medium flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {(stock.price * sellQuantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span>You own</span>
                    <span className="font-medium">{sharesOwned} share{sharesOwned !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleSell}
                    disabled={!sellQuantity || sellQuantity > sharesOwned}
                  >
                    Sell {sellQuantity} share{sellQuantity !== 1 ? 's' : ''}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Position</CardTitle>
            </CardHeader>
            <CardContent>
              {ownedStock ? (
                <div className="space-y-4">
                  <div className="border rounded-md p-3 space-y-2 bg-muted/20">
                    <div className="flex justify-between text-sm">
                      <span>Shares owned</span>
                      <span className="font-medium">{ownedStock.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average price</span>
                      <span className="font-medium flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {ownedStock.avgPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Current value</span>
                      <span className="font-medium flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {(ownedStock.quantity * stock.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span>Profit/Loss</span>
                      <span className={cn(
                        "font-medium flex items-center gap-1",
                        stock.price > ownedStock.avgPrice ? "text-emerald-600" : 
                        stock.price < ownedStock.avgPrice ? "text-red-600" : ""
                      )}>
                        <IndianRupee className="h-3 w-3" />
                        {((stock.price - ownedStock.avgPrice) * ownedStock.quantity).toFixed(2)}
                        <span className="text-xs">
                          ({(((stock.price / ownedStock.avgPrice) - 1) * 100).toFixed(2)}%)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <BarChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>You don't own any shares of {stock.symbol}</p>
                  <p className="text-sm mt-1">Buy shares to start tracking your position</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
