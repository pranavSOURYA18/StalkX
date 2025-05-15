
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IndianRupee, ArrowUp, ArrowDown, Bookmark, BarChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStocks } from '@/contexts/StockContext';

const Wishlist = () => {
  const { stocks, wishlist, removeFromWishlist } = useStocks();
  const navigate = useNavigate();
  
  const wishlistStocks = stocks.filter(stock => wishlist.includes(stock.id));

  const handleStockClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Wishlist</h2>
        <p className="text-muted-foreground">Track stocks you're interested in</p>
      </div>
      
      {wishlistStocks.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Saved Stocks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wishlistStocks.map((stock) => (
                  <TableRow key={stock.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell onClick={(e) => { e.stopPropagation(); removeFromWishlist(stock.id); }}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="h-4 w-4 fill-stalkx-500 text-stalkx-500" />
                      </Button>
                    </TableCell>
                    <TableCell 
                      className="font-medium"
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      {stock.name}
                    </TableCell>
                    <TableCell onClick={() => handleStockClick(stock.symbol)}>
                      {stock.symbol}
                    </TableCell>
                    <TableCell className="text-right" onClick={() => handleStockClick(stock.symbol)}>
                      <div className="flex items-center justify-end gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>{stock.price.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell 
                      className="text-right" 
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <div className={cn(
                        "flex items-center justify-end gap-1",
                        stock.change > 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {stock.change > 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        <span>{Math.abs(stock.change).toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell 
                      className="text-right"
                      onClick={() => handleStockClick(stock.symbol)}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>{(stock.marketCap/1000).toFixed(0)}K Cr</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleStockClick(stock.symbol)}
                      >
                        <BarChart className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Bookmark className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-1">No stocks in your wishlist</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add stocks to your wishlist to track them easily
          </p>
          <Button onClick={() => navigate('/explore')}>Browse Stocks</Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
