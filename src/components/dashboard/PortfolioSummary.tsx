
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Wallet, IndianRupee } from 'lucide-react';

const PortfolioSummary = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹1,25,450.75</div>
          <p className="text-xs text-muted-foreground">
            +₹5,240 (4.2%)
          </p>
        </CardContent>
      </Card>
      
      <Card className="animate-scale-in animation-delay-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹1,00,000.00</div>
          <p className="text-xs text-muted-foreground">
            Last deposit: ₹10,000 on 10 May
          </p>
        </CardContent>
      </Card>
      
      <Card className="animate-scale-in animation-delay-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">₹25,450.75</div>
          <p className="text-xs text-muted-foreground">
            ROI: 25.45%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioSummary;
