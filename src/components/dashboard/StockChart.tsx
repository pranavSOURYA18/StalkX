
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const stockData = [
  { date: "Jan", price: 62000 },
  { date: "Feb", price: 64000 },
  { date: "Mar", price: 63000 },
  { date: "Apr", price: 66000 },
  { date: "May", price: 68000 },
  { date: "Jun", price: 72000 },
  { date: "Jul", price: 76000 },
  { date: "Aug", price: 78000 },
  { date: "Sep", price: 82000 },
  { date: "Oct", price: 88000 },
  { date: "Nov", price: 94000 },
  { date: "Dec", price: 96000 },
];

const StockChart = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <CardDescription>Your investment growth over time</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stockData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1087ed" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1087ed" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => `₹${value/1000}k`}
              domain={['dataMin - 5000', 'dataMax + 5000']}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'Portfolio Value']} 
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
  );
};

export default StockChart;
