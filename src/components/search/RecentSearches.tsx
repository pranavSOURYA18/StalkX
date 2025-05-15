
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Clock, Search } from 'lucide-react';

interface RecentSearchesProps {
  onClose?: () => void;
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

  const handleSearchClick = (symbol: string) => {
    if (onClose) onClose();
    navigate(`/stock/${symbol}`);
  };

  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-2">
        <div className="p-2 text-sm text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>Recent searches</span>
        </div>
        <div className="space-y-1">
          {recentSearches.map((search: any) => (
            <div 
              key={search.symbol}
              className="flex items-center p-2 rounded-md hover:bg-muted cursor-pointer"
              onClick={() => handleSearchClick(search.symbol)}
            >
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">{search.name}</div>
                <div className="text-xs text-muted-foreground">{search.symbol}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSearches;
