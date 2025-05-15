
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const newsItems = [
  {
    headline: "RBI announces new regulations for fintech companies",
    source: "Economic Times",
    timeAgo: "3 hours ago",
  },
  {
    headline: "Reliance Industries posts record quarterly profit",
    source: "Business Standard",
    timeAgo: "5 hours ago",
  },
  {
    headline: "Government plans to reduce import duties on electronic components",
    source: "Mint",
    timeAgo: "8 hours ago",
  },
  {
    headline: "Infosys wins major contract with European banking client",
    source: "Financial Express",
    timeAgo: "1 day ago",
  },
];

const NewsWidget = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
        <CardDescription>Stay updated with market news</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
              <h4 className="font-medium hover:text-stalkx-500 cursor-pointer">
                {item.headline}
              </h4>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{item.source}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsWidget;
