
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const newsItems = [
  {
    id: 1,
    headline: "RBI announces new regulations for fintech companies",
    summary: "The Reserve Bank of India (RBI) has introduced new regulations for fintech companies operating in the country. The guidelines aim to enhance customer protection and data security while promoting innovation in the financial sector.",
    source: "Economic Times",
    category: "banking",
    timeAgo: "3 hours ago",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=500&h=300&fit=crop"
  },
  {
    id: 2,
    headline: "Reliance Industries posts record quarterly profit",
    summary: "Reliance Industries Limited (RIL) announced its highest-ever quarterly profit, beating market expectations. Strong performance in retail and digital services offset weakness in the petrochemical business.",
    source: "Business Standard",
    category: "earnings",
    timeAgo: "5 hours ago",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop"
  },
  {
    id: 3,
    headline: "Government plans to reduce import duties on electronic components",
    summary: "The Indian government is considering a reduction in import duties on electronic components to boost local manufacturing. The move is expected to benefit companies in the electronics and semiconductor sectors.",
    source: "Mint",
    category: "policy",
    timeAgo: "8 hours ago",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop"
  },
  {
    id: 4,
    headline: "Infosys wins major contract with European banking client",
    summary: "Infosys has secured a significant multi-year contract with a leading European bank for digital transformation services. The deal is valued at over $200 million and will involve modernizing the bank's IT infrastructure.",
    source: "Financial Express",
    category: "technology",
    timeAgo: "1 day ago",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop"
  },
  {
    id: 5,
    headline: "SEBI tightens rules for mutual fund investments",
    summary: "The Securities and Exchange Board of India (SEBI) has announced stricter regulations for mutual fund investments in unlisted securities. The move aims to protect investor interests and enhance transparency in the mutual fund industry.",
    source: "Livemint",
    category: "policy",
    timeAgo: "1 day ago",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=300&fit=crop"
  },
  {
    id: 6,
    headline: "Tata Steel reports strong domestic sales growth",
    summary: "Tata Steel has reported robust growth in domestic sales for the quarter, despite challenging global market conditions. The company's focus on value-added products and cost optimization has helped maintain profitability.",
    source: "Economic Times",
    category: "earnings",
    timeAgo: "2 days ago",
    image: "https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=500&h=300&fit=crop"
  },
];

const News = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Latest News</h2>
        <p className="text-muted-foreground">Stay updated with market news and developments</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 md:w-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="policy">Policy</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video w-full">
                  <img
                    src={item.image}
                    alt={item.headline}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="capitalize">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
                  </div>
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-lg">{item.headline}</CardTitle>
                  </CardHeader>
                  <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                  <div className="text-xs font-semibold">Source: {item.source}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="earnings" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems
              .filter((item) => item.category === "earnings")
              .map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video w-full">
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
                    </div>
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-lg">{item.headline}</CardTitle>
                    </CardHeader>
                    <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                    <div className="text-xs font-semibold">Source: {item.source}</div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="policy" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems
              .filter((item) => item.category === "policy")
              .map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video w-full">
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
                    </div>
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-lg">{item.headline}</CardTitle>
                    </CardHeader>
                    <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                    <div className="text-xs font-semibold">Source: {item.source}</div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="technology" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems
              .filter((item) => item.category === "technology")
              .map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video w-full">
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
                    </div>
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-lg">{item.headline}</CardTitle>
                    </CardHeader>
                    <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                    <div className="text-xs font-semibold">Source: {item.source}</div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="banking" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newsItems
              .filter((item) => item.category === "banking")
              .map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video w-full">
                    <img
                      src={item.image}
                      alt={item.headline}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {item.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{item.timeAgo}</span>
                    </div>
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-lg">{item.headline}</CardTitle>
                    </CardHeader>
                    <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                    <div className="text-xs font-semibold">Source: {item.source}</div>
                  </CardContent>
                </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default News;
