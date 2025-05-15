
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IndianRupee, ArrowUp, ArrowDown, Filter, Search, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStocks } from '@/contexts/StockContext';
import { useAuth } from '@/contexts/AuthContext';
import RecentSearches from '@/components/search/RecentSearches';
import useClickOutside from '@/hooks/use-click-outside';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRecents, setShowRecents] = useState(false);
  const { stocks, addToWishlist, removeFromWishlist, isInWishlist } = useStocks();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchRef, () => {
    setTimeout(() => setShowRecents(false), 100);
  });

  const filteredStocks = stocks.filter(stock => 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleWishlist = (e: React.MouseEvent, stockId: number) => {
    e.stopPropagation();
    if (isInWishlist(stockId)) {
      removeFromWishlist(stockId);
    } else {
      addToWishlist(stockId);
    }
  };

  const handleRowClick = (symbol: string) => {
    // Add to recent searches
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const stock = stocks.find(s => s.symbol === symbol);
    
    if (stock) {
      const search = {
        id: stock.id,
        name: stock.name,
        symbol: stock.symbol,
        timestamp: new Date().toISOString()
      };
      
      const filteredSearches = recentSearches.filter((s: any) => s.symbol !== symbol);
      const newSearches = [search, ...filteredSearches].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    }
    
    // Navigate to stock detail page
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Explore Stocks</h2>
        <p className="text-muted-foreground">Browse and search through 150+ Indian stocks</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1" ref={searchRef}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stocks by name or symbol..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowRecents(true)}
          />
          {showRecents && (
            <div className="absolute z-50 w-full mt-1">
              <RecentSearches onClose={() => setShowRecents(false)} />
            </div>
          )}
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow 
                    key={stock.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(stock.symbol)}
                  >
                    <TableCell onClick={(e) => isAuthenticated && toggleWishlist(e, stock.id)}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={!isAuthenticated}
                      >
                        <Bookmark 
                          className={cn("h-4 w-4", 
                            isInWishlist(stock.id) 
                              ? "fill-stalkx-500 text-stalkx-500" 
                              : "text-muted-foreground"
                          )} 
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{stock.name}</TableCell>
                    <TableCell>{stock.symbol}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>{stock.price.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={cn(
                        "flex items-center justify-end gap-1",
                        stock.change > 0 ? "text-emerald-600" : stock.change < 0 ? "text-red-600" : ""
                      )}>
                        {stock.change > 0 ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : stock.change < 0 ? (
                          <ArrowDown className="h-3 w-3" />
                        ) : null}
                        <span>{Math.abs(stock.change).toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{stock.volume.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>{(stock.marketCap/1000).toFixed(0)}K Cr</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Explore;
