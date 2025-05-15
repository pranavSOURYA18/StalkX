
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IndianRupee, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useStocks } from '@/contexts/StockContext';
import { Link } from 'react-router-dom';

interface PortfolioItem {
  id: string;
  stockId: number;
  quantity: number;
  buyPrice: number;
  timestamp: string;
}

const UserPortfolio = () => {
  const { user } = useAuth();
  const { stocks } = useStocks();
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (user) {
      const userPortfolio = JSON.parse(localStorage.getItem(`portfolio_${user.id}`) || '[]');
      setPortfolio(userPortfolio);
    }
  }, [user]);

  const getStockDetails = (stockId: number) => {
    return stocks.find(s => s.id === stockId);
  };

  const calculateProfit = (item: PortfolioItem) => {
    const stock = getStockDetails(item.stockId);
    if (!stock) return 0;
    
    const currentValue = stock.price * item.quantity;
    const boughtValue = item.buyPrice * item.quantity;
    return currentValue - boughtValue;
  };

  const calculateProfitPercentage = (item: PortfolioItem) => {
    const profit = calculateProfit(item);
    const boughtValue = item.buyPrice * item.quantity;
    return (profit / boughtValue) * 100;
  };

  if (portfolio.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Portfolio</CardTitle>
          <CardDescription>Stocks you currently own</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">You don't own any stocks yet.</p>
          <p className="text-sm mt-2">Start building your portfolio by buying stocks from the <Link to="/explore" className="text-stalkx-500 hover:underline">Explore</Link> page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Portfolio</CardTitle>
        <CardDescription>Stocks you currently own</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Buy Price</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Profit/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.map((item) => {
              const stock = getStockDetails(item.stockId);
              if (!stock) return null;
              
              const profit = calculateProfit(item);
              const profitPercentage = calculateProfitPercentage(item);
              
              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <Link to={`/stock/${stock.symbol}`} className="hover:underline">
                      {stock.name} ({stock.symbol})
                    </Link>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-3 w-3" />
                      <span>{item.buyPrice.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <IndianRupee className="h-3 w-3" />
                      <span>{stock.price.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className={cn(
                    "text-right",
                    profit >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    <div className="flex items-center justify-end gap-1">
                      {profit >= 0 ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      <span>₹{Math.abs(profit).toFixed(2)} ({Math.abs(profitPercentage).toFixed(2)}%)</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserPortfolio;
