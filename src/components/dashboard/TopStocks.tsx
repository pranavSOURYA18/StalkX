
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndianRupee, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const stockData = [
  {
    name: "Reliance Industries",
    price: 2870.45,
    change: 2.5,
    volume: "High",
  },
  {
    name: "HDFC Bank",
    price: 1690.30,
    change: 1.2,
    volume: "Medium",
  },
  {
    name: "Infosys",
    price: 1450.75,
    change: -0.8,
    volume: "High",
  },
  {
    name: "TCS",
    price: 3540.60,
    change: 0.5,
    volume: "Medium",
  },
  {
    name: "Bharti Airtel",
    price: 920.15,
    change: -1.3,
    volume: "Low",
  }
];

const TopStocks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Movers</CardTitle>
        <CardDescription>Top performing stocks today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stockData.map((stock, index) => (
            <div 
              key={index}
              className="flex items-center justify-between rounded-lg border p-3 text-sm"
            >
              <div className="font-medium">{stock.name}</div>
              <div className="flex items-center gap-4">
                <Badge 
                  variant={stock.volume === "High" ? "default" : stock.volume === "Medium" ? "outline" : "secondary"} 
                  className="text-xs"
                >
                  {stock.volume}
                </Badge>
                <div className="flex w-24 flex-col text-right">
                  <div className="flex items-center justify-end gap-1 font-medium">
                    <IndianRupee className="h-3 w-3" />
                    {stock.price}
                  </div>
                  <div 
                    className={cn(
                      "text-xs flex items-center justify-end",
                      stock.change > 0 ? "text-emerald-600" : "text-red-600"
                    )}
                  >
                    {stock.change > 0 ? (
                      <>
                        <ArrowUp className="mr-1 h-3 w-3" />
                        {stock.change}%
                      </>
                    ) : (
                      <>
                        <ArrowDown className="mr-1 h-3 w-3" />
                        {Math.abs(stock.change)}%
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopStocks;
