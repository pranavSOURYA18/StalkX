
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Stock {
  id: number;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
}

export interface StockTransaction {
  id: string;
  stockId: number;
  symbol: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  type: 'buy' | 'sell';
  date: string;
}

export interface StockPortfolio {
  stockId: number;
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

interface StockContextType {
  stocks: Stock[];
  wishlist: number[];
  portfolio: StockPortfolio[];
  transactions: StockTransaction[];
  addToWishlist: (stockId: number) => void;
  removeFromWishlist: (stockId: number) => void;
  isInWishlist: (stockId: number) => boolean;
  buyStock: (stock: Stock, quantity: number) => boolean;
  sellStock: (stock: Stock, quantity: number) => boolean;
  getHistoricalData: (symbol: string, timeframe: 'day' | 'month' | 'year') => any[];
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function useStocks() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStocks must be used within a StockProvider');
  }
  return context;
}

// Sample stocks data
const sampleStocks = [
  { id: 1, name: "Reliance Industries", symbol: "RELIANCE", price: 2870.45, change: 2.5, volume: 123456, marketCap: 1824500 },
  { id: 2, name: "Tata Consultancy Services", symbol: "TCS", price: 3540.60, change: 0.5, volume: 98765, marketCap: 1298700 },
  { id: 3, name: "HDFC Bank", symbol: "HDFCBANK", price: 1690.30, change: 1.2, volume: 154832, marketCap: 942800 },
  { id: 4, name: "Infosys", symbol: "INFY", price: 1450.75, change: -0.8, volume: 112435, marketCap: 624300 },
  { id: 5, name: "Bharti Airtel", symbol: "BHARTIARTL", price: 920.15, change: -1.3, volume: 87245, marketCap: 523600 },
  { id: 6, name: "ITC Limited", symbol: "ITC", price: 435.20, change: 0.2, volume: 198723, marketCap: 543200 },
  { id: 7, name: "Hindustan Unilever", symbol: "HINDUNILVR", price: 2580.40, change: -0.3, volume: 76543, marketCap: 607500 },
  { id: 8, name: "ICICI Bank", symbol: "ICICIBANK", price: 945.65, change: 1.7, volume: 143256, marketCap: 662800 },
  { id: 9, name: "State Bank of India", symbol: "SBIN", price: 625.30, change: 0.8, volume: 165432, marketCap: 558700 },
  { id: 10, name: "Larsen & Toubro", symbol: "LT", price: 2780.90, change: 2.1, volume: 87654, marketCap: 391500 },
];

interface StockProviderProps {
  children: ReactNode;
}

export function StockProvider({ children }: StockProviderProps) {
  const { user, updateUserBalance } = useAuth();
  const [stocks] = useState<Stock[]>(sampleStocks);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [portfolio, setPortfolio] = useState<StockPortfolio[]>([]);
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);

  // Load wishlist and portfolio from localStorage when user changes
  useEffect(() => {
    if (user) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find((u: any) => u.id === user.id);
      
      if (currentUser) {
        setWishlist(currentUser.wishlist || []);
        setPortfolio(currentUser.portfolio || []);
        setTransactions(currentUser.transactions || []);
      }
    } else {
      setWishlist([]);
      setPortfolio([]);
      setTransactions([]);
    }
  }, [user]);

  // Update localStorage whenever wishlist changes
  const updateUserData = (newWishlist: number[], newPortfolio: StockPortfolio[], newTransactions: StockTransaction[]) => {
    if (!user) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return {
          ...u,
          wishlist: newWishlist,
          portfolio: newPortfolio,
          transactions: newTransactions
        };
      }
      return u;
    });
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const addToWishlist = (stockId: number) => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    
    if (!wishlist.includes(stockId)) {
      const newWishlist = [...wishlist, stockId];
      setWishlist(newWishlist);
      updateUserData(newWishlist, portfolio, transactions);
      toast.success('Added to wishlist');
    }
  };

  const removeFromWishlist = (stockId: number) => {
    if (!user) return;
    
    const newWishlist = wishlist.filter(id => id !== stockId);
    setWishlist(newWishlist);
    updateUserData(newWishlist, portfolio, transactions);
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (stockId: number) => {
    return wishlist.includes(stockId);
  };

  const buyStock = (stock: Stock, quantity: number): boolean => {
    if (!user) {
      toast.error('Please login to buy stocks');
      return false;
    }
    
    const totalCost = stock.price * quantity;
    
    if (user.balance < totalCost) {
      toast.error('Insufficient balance');
      return false;
    }
    
    // Update user balance
    const newBalance = user.balance - totalCost;
    updateUserBalance(newBalance);
    
    // Update portfolio
    let newPortfolio = [...portfolio];
    const existingStock = newPortfolio.find(item => item.stockId === stock.id);
    
    if (existingStock) {
      // Calculate new average price
      const totalShares = existingStock.quantity + quantity;
      const totalInvestment = (existingStock.avgPrice * existingStock.quantity) + totalCost;
      const newAvgPrice = totalInvestment / totalShares;
      
      newPortfolio = newPortfolio.map(item => {
        if (item.stockId === stock.id) {
          return {
            ...item,
            quantity: totalShares,
            avgPrice: newAvgPrice,
            currentPrice: stock.price
          };
        }
        return item;
      });
    } else {
      newPortfolio.push({
        stockId: stock.id,
        symbol: stock.symbol,
        name: stock.name,
        quantity,
        avgPrice: stock.price,
        currentPrice: stock.price
      });
    }
    
    // Add transaction
    const newTransaction: StockTransaction = {
      id: crypto.randomUUID(),
      stockId: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      quantity,
      price: stock.price,
      total: totalCost,
      type: 'buy',
      date: new Date().toISOString()
    };
    
    const newTransactions = [...transactions, newTransaction];
    
    // Update state and localStorage
    setPortfolio(newPortfolio);
    setTransactions(newTransactions);
    updateUserData(wishlist, newPortfolio, newTransactions);
    
    toast.success(`Bought ${quantity} shares of ${stock.symbol}`);
    return true;
  };

  const sellStock = (stock: Stock, quantity: number): boolean => {
    if (!user) {
      toast.error('Please login to sell stocks');
      return false;
    }
    
    // Check if user owns the stock
    const existingStock = portfolio.find(item => item.stockId === stock.id);
    
    if (!existingStock || existingStock.quantity < quantity) {
      toast.error('Not enough shares to sell');
      return false;
    }
    
    const saleValue = stock.price * quantity;
    
    // Update user balance
    const newBalance = user.balance + saleValue;
    updateUserBalance(newBalance);
    
    // Update portfolio
    let newPortfolio = [...portfolio];
    
    if (existingStock.quantity === quantity) {
      // Remove stock from portfolio if selling all shares
      newPortfolio = newPortfolio.filter(item => item.stockId !== stock.id);
    } else {
      // Update quantity if selling some shares
      newPortfolio = newPortfolio.map(item => {
        if (item.stockId === stock.id) {
          return {
            ...item,
            quantity: item.quantity - quantity,
            currentPrice: stock.price
          };
        }
        return item;
      });
    }
    
    // Add transaction
    const newTransaction: StockTransaction = {
      id: crypto.randomUUID(),
      stockId: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      quantity,
      price: stock.price,
      total: saleValue,
      type: 'sell',
      date: new Date().toISOString()
    };
    
    const newTransactions = [...transactions, newTransaction];
    
    // Update state and localStorage
    setPortfolio(newPortfolio);
    setTransactions(newTransactions);
    updateUserData(wishlist, newPortfolio, newTransactions);
    
    toast.success(`Sold ${quantity} shares of ${stock.symbol}`);
    return true;
  };

  // Generate mock historical data
  const getHistoricalData = (symbol: string, timeframe: 'day' | 'month' | 'year') => {
    const stock = stocks.find(s => s.symbol === symbol);
    const basePrice = stock?.price || 1000;
    const data = [];
    
    const volatility = 0.02; // 2% volatility
    const points = timeframe === 'day' ? 24 : timeframe === 'month' ? 30 : 12;
    const labelFormat = timeframe === 'day' ? 'h:mm a' : timeframe === 'month' ? 'd MMM' : 'MMM yyyy';
    
    for (let i = 0; i < points; i++) {
      const randomChange = (Math.random() - 0.5) * volatility * basePrice;
      const date = timeframe === 'day' 
        ? `${i}:00` 
        : timeframe === 'month' 
          ? `Day ${i+1}` 
          : `Month ${i+1}`;
          
      data.push({
        date,
        price: basePrice + randomChange * (i + 1),
      });
    }
    
    return data;
  };

  return (
    <StockContext.Provider value={{ 
      stocks,
      wishlist,
      portfolio,
      transactions,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      buyStock,
      sellStock,
      getHistoricalData
    }}>
      {children}
    </StockContext.Provider>
  );
}
