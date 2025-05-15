
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SuggestedQuestion {
  id: string;
  text: string;
  level: 'beginner' | 'intermediate' | 'pro';
}

// Pre-defined questions for each level
const suggestedQuestions: SuggestedQuestion[] = [
  // Beginner questions
  { id: 'b1', text: 'What is the stock market?', level: 'beginner' },
  { id: 'b2', text: 'How do I start investing with small amounts?', level: 'beginner' },
  { id: 'b3', text: 'What are dividends?', level: 'beginner' },
  { id: 'b4', text: 'What is the difference between stocks and bonds?', level: 'beginner' },
  { id: 'b5', text: 'How do I open a demat account?', level: 'beginner' },
  { id: 'b6', text: 'What are mutual funds?', level: 'beginner' },
  { id: 'b7', text: 'What is the BSE and NSE?', level: 'beginner' },
  { id: 'b8', text: 'What is market capitalization?', level: 'beginner' },
  { id: 'b9', text: 'How are stock prices determined?', level: 'beginner' },
  { id: 'b10', text: 'What are index funds?', level: 'beginner' },
  { id: 'b11', text: 'What are ETFs?', level: 'beginner' },
  { id: 'b12', text: 'What taxes do I pay on stock investments?', level: 'beginner' },
  { id: 'b13', text: 'What is dollar-cost averaging?', level: 'beginner' },
  { id: 'b14', text: 'How do I read stock charts?', level: 'beginner' },
  { id: 'b15', text: 'What is a bull and bear market?', level: 'beginner' },
  
  // Intermediate questions
  { id: 'i1', text: 'What are P/E ratios and how do I use them?', level: 'intermediate' },
  { id: 'i2', text: 'How do I analyze a company\'s financial statements?', level: 'intermediate' },
  { id: 'i3', text: 'What is fundamental analysis?', level: 'intermediate' },
  { id: 'i4', text: 'What is technical analysis?', level: 'intermediate' },
  { id: 'i5', text: 'How do I build a diversified portfolio?', level: 'intermediate' },
  { id: 'i6', text: 'What are EPS and PEG ratios?', level: 'intermediate' },
  { id: 'i7', text: 'How do I evaluate a company\'s management?', level: 'intermediate' },
  { id: 'i8', text: 'What is sector rotation strategy?', level: 'intermediate' },
  { id: 'i9', text: 'How do quarterly results affect stock prices?', level: 'intermediate' },
  { id: 'i10', text: 'What is the difference between growth and value investing?', level: 'intermediate' },
  { id: 'i11', text: 'How do interest rates affect the stock market?', level: 'intermediate' },
  { id: 'i12', text: 'What is portfolio rebalancing?', level: 'intermediate' },
  { id: 'i13', text: 'How do I use moving averages in stock analysis?', level: 'intermediate' },
  { id: 'i14', text: 'What are stock sectors and how do they perform in different economic cycles?', level: 'intermediate' },
  { id: 'i15', text: 'What is the difference between active and passive investing?', level: 'intermediate' },
  
  // Pro questions
  { id: 'p1', text: 'What are options and how do they work?', level: 'pro' },
  { id: 'p2', text: 'How do I use futures contracts in my investment strategy?', level: 'pro' },
  { id: 'p3', text: 'What is a covered call strategy?', level: 'pro' },
  { id: 'p4', text: 'How do I calculate intrinsic value of a stock?', level: 'pro' },
  { id: 'p5', text: 'What are the different options trading strategies?', level: 'pro' },
  { id: 'p6', text: 'How do I use the Black-Scholes model?', level: 'pro' },
  { id: 'p7', text: 'How do I implement a pairs trading strategy?', level: 'pro' },
  { id: 'p8', text: 'What is algorithmic trading?', level: 'pro' },
  { id: 'p9', text: 'How do I set up a systematic trading model?', level: 'pro' },
  { id: 'p10', text: 'What are advanced risk management techniques for portfolios?', level: 'pro' },
  { id: 'p11', text: 'How do I implement factor investing strategies?', level: 'pro' },
  { id: 'p12', text: 'What are volatility-based trading strategies?', level: 'pro' },
  { id: 'p13', text: 'How do I use Fibonacci retracement in technical analysis?', level: 'pro' },
  { id: 'p14', text: 'What is Elliot Wave Theory and how can I apply it?', level: 'pro' },
  { id: 'p15', text: 'How do I create and backtest a trading strategy?', level: 'pro' },
];

// Stock market knowledge base for AI responses
const stockMarketKnowledge = {
  beginner: {
    "stock market": "The stock market is a public marketplace where shares of companies are bought and sold. It serves as a platform for companies to raise capital and for investors to buy ownership in these companies with the potential to earn returns through price appreciation and dividends.",
    "investing": "Investing is the act of allocating resources (usually money) into assets with the expectation of generating income or profit over time. In the context of the stock market, it typically involves buying shares of companies with the goal of building wealth.",
    "dividends": "Dividends are payments made by companies to their shareholders from their profits. They are typically paid quarterly and represent a way for companies to share their success with investors. Dividends provide a steady income stream for investors, especially in established companies.",
    "stocks vs bonds": "Stocks represent ownership in a company, while bonds represent loans made to a company or government. Stocks generally offer higher potential returns but with higher risk, while bonds typically provide more stable but lower returns through regular interest payments.",
    "demat account": "A demat (dematerialized) account is an electronic account that holds your securities (shares, bonds, etc.) in digital form. In India, you need a demat account, along with a trading account, to buy and sell shares on stock exchanges like NSE and BSE.",
    "mutual funds": "Mutual funds pool money from multiple investors to invest in a diversified portfolio of stocks, bonds, or other securities. They are managed by professional fund managers and allow investors with limited capital to access diversified portfolios.",
    "bse nse": "BSE (Bombay Stock Exchange) and NSE (National Stock Exchange) are the two main stock exchanges in India. BSE is the oldest stock exchange in Asia, while NSE is the largest stock exchange in India by trading volume. Companies list their shares on these exchanges for public trading.",
    "market capitalization": "Market capitalization, or 'market cap,' is the total value of a company's outstanding shares. It's calculated by multiplying the current share price by the total number of outstanding shares. Market cap helps categorize companies as large-cap, mid-cap, or small-cap.",
    "stock prices": "Stock prices are determined by supply and demand in the market. When more people want to buy a stock than sell it, the price goes up. Conversely, when more people want to sell than buy, the price goes down. Factors influencing these decisions include company performance, economic conditions, and market sentiment.",
    "index funds": "Index funds are mutual funds or ETFs designed to track the performance of a specific market index, like the S&P 500 or Nifty 50. They offer broad market exposure, low operating expenses, and low portfolio turnover. They're a popular choice for passive investors.",
    "etfs": "Exchange-Traded Funds (ETFs) are investment funds traded on stock exchanges, much like stocks. They hold assets such as stocks, bonds, or commodities and generally operate with lower fees than mutual funds. ETFs combine the diversification benefits of mutual funds with the trading flexibility of stocks.",
    "taxes": "In India, profits from stocks held for less than 12 months are subject to Short-Term Capital Gains (STCG) tax at 15%. Profits from stocks held longer than 12 months are subject to Long-Term Capital Gains (LTCG) tax at 10% (for gains exceeding ₹1 lakh). Dividends are taxed at your income tax slab rate.",
    "dollar-cost averaging": "Dollar-cost averaging is an investment strategy where you invest a fixed amount of money at regular intervals, regardless of market conditions. This approach reduces the impact of market volatility on your overall purchase and helps avoid the pitfalls of trying to time the market.",
    "stock charts": "Stock charts graphically display a stock's price movements over time. Basic chart types include line charts (showing closing prices), bar charts (showing open, high, low, close), and candlestick charts (similar to bar charts but with color-coding to show price direction).",
    "bull bear market": "A bull market is characterized by rising stock prices and optimism, typically defined as a 20% rise from a previous low. A bear market refers to a period of falling stock prices, typically defined as a 20% decline from a previous high, accompanied by pessimism and negative investor sentiment."
  },
  intermediate: {
    "pe ratio": "The Price-to-Earnings (P/E) ratio is calculated by dividing a company's share price by its earnings per share (EPS). It indicates how much investors are willing to pay for each rupee of earnings. A high P/E suggests investors expect higher growth in the future, while a low P/E might indicate an undervalued stock or concerns about future performance.",
    "financial statements": "Key financial statements to analyze include the Income Statement (showing revenue, expenses, and profits), Balance Sheet (showing assets, liabilities, and equity), and Cash Flow Statement (showing cash movements). Focus on trends in revenue growth, profit margins, debt levels, and cash generation to assess a company's financial health.",
    "fundamental analysis": "Fundamental analysis involves evaluating a company's financial health, competitive position, management quality, and growth prospects to determine its intrinsic value. It includes analyzing financial statements, industry trends, competitive advantages, and macroeconomic factors to make investment decisions.",
    "technical analysis": "Technical analysis uses price charts and statistical indicators to identify patterns and trends that may predict future price movements. Unlike fundamental analysis, it focuses on price movements rather than company fundamentals. Common techniques include analyzing support and resistance levels, moving averages, and various chart patterns.",
    "diversified portfolio": "Build a diversified portfolio by investing across different asset classes (stocks, bonds, real estate), sectors (technology, healthcare, financial), geographies (domestic, international), and market capitalizations (large, mid, small). Aim for investments that don't all move in the same direction at the same time to reduce overall portfolio risk.",
    "eps peg ratio": "Earnings Per Share (EPS) represents a company's profit divided by outstanding shares. The Price/Earnings to Growth (PEG) ratio equals the P/E ratio divided by expected earnings growth rate. A PEG below 1 may indicate an undervalued stock, considering both current price and future growth potential.",
    "company management": "Evaluate management by examining their track record, strategic vision, execution ability, and shareholder alignment. Look for consistent delivery on promises, transparent communication, effective capital allocation, reasonable executive compensation, and significant ownership stakes by key executives.",
    "sector rotation": "Sector rotation involves shifting investments between different sectors based on economic cycles. In early expansion, consider consumer discretionary and technology; in late expansion, energy and materials; during contraction, consumer staples and healthcare; in early recovery, financials and industrials. This strategy aims to capitalize on how different sectors perform in various economic phases.",
    "quarterly results": "Quarterly results can significantly impact stock prices, especially when they deviate from analyst expectations. Focus not just on headline numbers but also on guidance, management commentary, margin trends, and any one-time factors. Stocks often react more to future outlook than past performance.",
    "growth vs value": "Growth investing focuses on companies with above-average revenue and earnings growth potential, often trading at high valuations with expectations of future profits. Value investing targets undervalued companies trading below their intrinsic worth, often with lower P/E ratios, higher dividend yields, and solid current fundamentals.",
    "interest rates": "Higher interest rates typically pressure stock prices by increasing borrowing costs for companies and making fixed-income investments more attractive alternatives to stocks. Rate-sensitive sectors like utilities, real estate, and consumer discretionary often suffer most. Conversely, financial stocks may benefit from higher rates through improved lending margins.",
    "portfolio rebalancing": "Portfolio rebalancing involves periodically buying and selling assets to maintain your target asset allocation. For example, if your strategy calls for 60% stocks and 40% bonds, but market movements shift this to 70/30, you'd sell some stocks and buy bonds to restore the original ratio. This enforces a 'buy low, sell high' discipline.",
    "moving averages": "Moving averages smooth out price data by creating a constantly updated average price over a specific time period (e.g., 50-day or 200-day). When a stock price crosses above its moving average, it's potentially bullish; crossing below is potentially bearish. The 'death cross' (50-day moving below 200-day) and 'golden cross' (50-day moving above 200-day) are significant signals watched by many traders.",
    "stock sectors": "Different stock sectors perform differently across economic cycles. Defensive sectors (utilities, consumer staples, healthcare) typically outperform during economic downturns due to stable demand. Cyclical sectors (technology, industrials, consumer discretionary) tend to outperform during economic expansions. Understanding these relationships helps with strategic asset allocation.",
    "active vs passive": "Active investing involves trying to outperform the market through stock selection and market timing, typically with higher fees and trading costs. Passive investing aims to match market returns by tracking indexes, with lower fees and typically lower turnover. While active management offers potential outperformance, studies show most active managers underperform their benchmarks after fees over long periods."
  },
  pro: {
    "options": "Options are financial derivatives that give the holder the right, but not the obligation, to buy (call option) or sell (put option) an underlying asset at a predetermined price (strike price) within a specific time period. They can be used for hedging, income generation, speculative trading, or leveraged exposure. Options pricing depends on factors like underlying price, strike price, time to expiration, volatility, interest rates, and dividends.",
    "futures contracts": "Futures are standardized contracts to buy or sell an asset at a predetermined price on a future date. Unlike options, futures obligate both parties to fulfill the contract. They're used for hedging price risk, speculative trading, or arbitrage. Futures require a margin deposit and are marked-to-market daily, meaning profits and losses are settled each day. They offer leverage but come with increased risk.",
    "covered call": "A covered call strategy involves holding a long position in an asset and selling call options on that same asset. This generates premium income that enhances returns in flat or moderately rising markets and provides limited downside protection. However, it caps upside potential as gains beyond the strike price are offset by losses on the option position. It's considered a conservative options strategy suitable for generating income from existing holdings.",
    "intrinsic value": "Intrinsic value represents a stock's 'true' worth based on its fundamentals, independent of market price. Calculation methods include discounted cash flow (DCF) analysis, which projects future cash flows and discounts them to present value using an appropriate discount rate. Other approaches include comparable company analysis, dividend discount models, and asset-based valuations. A margin of safety should be applied to account for projection uncertainties.",
    "options strategies": "Advanced options strategies include spreads (using multiple options to limit risk, like bull/bear spreads), straddles (buying both calls and puts with the same strike to profit from volatility), iron condors (selling out-of-money call and put spreads to profit from price stability), and butterflies (combining spreads to profit from specific price targets). Each strategy has unique risk-reward profiles and responds differently to changes in price, time, and volatility.",
    "black-scholes model": "The Black-Scholes model is a mathematical model for pricing options contracts. It incorporates variables including the current stock price, option strike price, time to expiration, risk-free rate, and implied volatility. While widely used, it has limitations, including assumptions of constant volatility, no dividends, efficient markets, and log-normal distribution of returns. Traders often use variations of the model that address some of these limitations.",
    "pairs trading": "Pairs trading involves simultaneously going long on one security and short on another related security when their typical price relationship deviates. The strategy is market-neutral and profits when the spread between securities returns to historical norms. Implementation requires identifying correlated pairs through statistical methods like cointegration testing, determining entry/exit points using standard deviation rules, and managing position sizes based on correlation strength.",
    "algorithmic trading": "Algorithmic trading uses computer algorithms to execute trading strategies at speeds and frequencies impossible for humans. It encompasses various approaches including statistical arbitrage (exploiting price inefficiencies), trend following, market making, and execution algorithms that minimize market impact. Implementation requires programming skills, reliable data feeds, backtesting capabilities, and robust risk management systems.",
    "systematic trading": "A systematic trading model involves rule-based decision making that removes emotional biases. To set up a model, define clear entry and exit rules, risk management parameters, and position sizing methodology. Backtest the strategy on historical data while accounting for slippage and transaction costs. Implement safeguards against system failure and extreme market conditions, and periodically review to ensure continued effectiveness.",
    "risk management": "Advanced portfolio risk management goes beyond diversification to include techniques like value at risk (VaR) analysis, stress testing extreme scenarios, setting stop-loss levels, using options for tail-risk hedging, and dynamic asset allocation based on volatility regimes. Optimize the risk-adjusted return using metrics like Sharpe ratio, Sortino ratio, and maximum drawdown. Consider correlation breakdowns during market stress when designing hedging strategies.",
    "factor investing": "Factor investing targets specific drivers of returns like value, momentum, size, quality, and low volatility. Implementation involves screening stocks based on factor exposures, weighting positions according to factor strength, and rebalancing periodically. Multi-factor approaches combine factors with low correlations to improve risk-adjusted returns. Smart beta ETFs offer a convenient way to access factor exposures without direct stock selection.",
    "volatility strategies": "Volatility-based strategies include volatility arbitrage (exploiting differences between implied and realized volatility), volatility risk premium harvesting (selling options to collect premium when implied volatility exceeds realized volatility), and volatility-targeting (adjusting equity exposure inversely to market volatility). The VIX index and VIX derivatives can be used to hedge against or speculate on volatility changes.",
    "fibonacci retracement": "Fibonacci retracement uses horizontal lines at key Fibonacci levels (23.6%, 38.2%, 50%, 61.8%, 78.6%) to identify potential support and resistance areas after a significant price movement. These levels often coincide with market turning points due to their widespread use. Combine with other technical indicators and price action patterns for confirmation. Extension levels (127.2%, 161.8%) can help project potential targets beyond the original move.",
    "elliot wave theory": "Elliott Wave Theory posits that markets move in repetitive patterns of 5 impulsive waves in the direction of the trend followed by 3 corrective waves. These patterns occur at multiple scales (degrees) simultaneously. Application requires identifying the current wave position, projecting future price movements based on wave relationships, and incorporating Fibonacci relationships between waves. While subjective, it provides a framework for understanding market psychology and trend changes.",
    "backtest trading": "To create and backtest a trading strategy, first define clear rules for entry, exit, position sizing, and risk management. Code these rules in a backtesting platform or language like Python (with libraries such as Pandas, Backtrader, or Quantopian). Test on sufficient historical data across different market conditions while accounting for transaction costs, slippage, and survivorship bias. Analyze performance metrics including returns, drawdowns, Sharpe ratio, and win rate. Guard against overfitting by using out-of-sample testing and parameter sensitivity analysis."
  }
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m StalkX Assistant. How can I help you learn about stock market investing today?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'pro'>('beginner');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Filter questions based on current level
  const filteredQuestions = suggestedQuestions.filter(q => q.level === level);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = (userMessage: string, userLevel: string) => {
    // Convert the message to lowercase for easier matching
    const lowerCaseMessage = userMessage.toLowerCase();
    
    // Get the appropriate knowledge base for the user level
    const knowledgeBase = stockMarketKnowledge[userLevel as keyof typeof stockMarketKnowledge];
    
    // Try to find a matching topic in the knowledge base
    let bestMatch = '';
    let matchScore = 0;
    
    for (const topic in knowledgeBase) {
      if (lowerCaseMessage.includes(topic)) {
        // Simple matching algorithm - longer matches are better
        if (topic.length > matchScore) {
          matchScore = topic.length;
          bestMatch = topic;
        }
      }
    }
    
    // If we found a match, return the corresponding answer
    if (bestMatch && matchScore > 0) {
      return knowledgeBase[bestMatch as keyof typeof knowledgeBase];
    }
    
    // Default responses based on level
    if (userLevel === 'beginner') {
      return "That's an interesting question! As a beginner, you might want to start with understanding the basics of how stock markets work. Would you like to know about stock market fundamentals, how to start investing with small amounts, or perhaps what some common investing terms mean?";
    } else if (userLevel === 'intermediate') {
      return "Great question! At your intermediate level, you might be interested in more detailed aspects like fundamental analysis, technical indicators, or portfolio diversification strategies. Would you like me to explain any of these concepts in more detail?";
    } else {
      return "That's a sophisticated question! For advanced investors like you, I can provide insights on complex strategies such as options trading, algorithmic approaches, or advanced risk management techniques. Which specific advanced topic would you like to explore further?";
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    
    // Simulate bot response using AI
    setTimeout(() => {
      const botResponse = generateAIResponse(question, level);
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Simulate bot response using AI
    setTimeout(() => {
      const botResponse = generateAIResponse(inputMessage, level);
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>StalkX Assistant</CardTitle>
          <CardDescription>Your personal stock market mentor</CardDescription>
          <Tabs value={level} onValueChange={(value) => setLevel(value as 'beginner' | 'intermediate' | 'pro')} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="pro">Pro</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-max max-w-[80%] flex-col gap-1 rounded-lg px-3 py-2 text-sm",
                  message.sender === 'user'
                    ? "ml-auto bg-stalkx-500 text-white"
                    : "bg-muted"
                )}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="flex w-max max-w-[80%] flex-col gap-1 rounded-lg bg-muted px-3 py-2 text-sm">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 delay-75"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2 mb-3">
            {filteredQuestions.slice(0, 5).map((question) => (
              <Button
                key={question.id}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedQuestion(question.text)}
                className="text-xs"
              >
                {question.text.length > 20 ? `${question.text.substring(0, 20)}...` : question.text}
              </Button>
            ))}
          </div>
        </div>
        <CardFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex w-full items-center gap-2"
          >
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatInterface;
