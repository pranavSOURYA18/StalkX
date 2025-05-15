
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Search, User, Moon, Sun } from 'lucide-react';
import Logo from '@/components/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import RecentSearches from '@/components/search/RecentSearches';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IndianRupee } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
      : '?';
  };

  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <Logo />
        </div>

        <nav className="flex items-center gap-2">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user ? getInitials(user.name) : ''}</AvatarFallback>
                    </Avatar>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="end">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{user ? getInitials(user.name) : ''}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="flex items-center gap-2 py-1">
                        <div className="flex items-center gap-1 text-sm">
                          <IndianRupee className="h-3 w-3" />
                          <span className="font-medium">{user?.balance?.toLocaleString()}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Available Balance</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-2 space-y-1">
                      <Link to="/profile">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
