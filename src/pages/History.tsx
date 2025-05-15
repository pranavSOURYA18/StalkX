
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

const transactions = [
  {
    id: 1,
    type: "buy",
    stock: "Reliance Industries",
    symbol: "RELIANCE",
    quantity: 5,
    price: 2850.45,
    total: 14252.25,
    date: "14 May 2024, 10:32 AM",
  },
  {
    id: 2,
    type: "sell",
    stock: "TCS",
    symbol: "TCS",
    quantity: 2,
    price: 3530.60,
    total: 7061.20,
    date: "12 May 2024, 11:15 AM",
  },
  {
    id: 3,
    type: "buy",
    stock: "HDFC Bank",
    symbol: "HDFCBANK",
    quantity: 10,
    price: 1685.30,
    total: 16853.00,
    date: "10 May 2024, 9:45 AM",
  },
  {
    id: 4,
    type: "deposit",
    amount: 50000,
    date: "8 May 2024, 2:30 PM",
  },
  {
    id: 5,
    type: "buy",
    stock: "Infosys",
    symbol: "INFY",
    quantity: 8,
    price: 1455.75,
    total: 11646.00,
    date: "5 May 2024, 3:20 PM",
  },
  {
    id: 6,
    type: "sell",
    stock: "Bharti Airtel",
    symbol: "BHARTIARTL",
    quantity: 12,
    price: 925.15,
    total: 11101.80,
    date: "2 May 2024, 10:05 AM",
  },
  {
    id: 7,
    type: "deposit",
    amount: 25000,
    date: "28 Apr 2024, 1:15 PM",
  },
];

const History = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transaction History</h2>
        <p className="text-muted-foreground">View your recent transactions</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Badge variant={transaction.type === "buy" ? "outline" : transaction.type === "sell" ? "default" : "secondary"}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.type === "deposit" ? (
                      <div className="font-medium">Account Deposit</div>
                    ) : (
                      <div>
                        <div className="font-medium">{transaction.stock} ({transaction.symbol})</div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.quantity} shares @ ₹{transaction.price.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="text-right">
                    <div className={cn(
                      "flex items-center justify-end gap-0.5 font-medium",
                      transaction.type === "buy" ? "text-red-600" : "text-emerald-600"
                    )}>
                      <IndianRupee className="h-3 w-3" />
                      <span>
                        {transaction.type === "deposit" || transaction.type === "sell" 
                          ? transaction.type === "deposit" 
                            ? transaction.amount.toLocaleString()
                            : transaction.total.toFixed(2)
                          : '-' + transaction.total.toFixed(2)
                        }
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
