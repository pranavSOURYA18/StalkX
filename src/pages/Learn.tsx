
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';

const Learn = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">StalkX Chat</h2>
        <p className="text-muted-foreground">Ask anything about the stock market and investing</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Learn;
