
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart, Bookmark, Users, History, Newspaper, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon: Icon, label, collapsed }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:text-foreground",
        isActive 
          ? "bg-accent text-foreground font-medium" 
          : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

const SideNavigation = () => {
  const isMobile = useIsMobile();
  const { open, setOpen } = useSidebar();
  
  const toggleSidebar = () => {
    setOpen(!open);
  };
  
  return (
    <div className="relative">
      <Sidebar>
        <SidebarContent className="p-2">
          <div className="flex justify-end mb-2">
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-md hover:bg-accent text-muted-foreground"
            >
              {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
          <div className="space-y-1 py-2">
            <NavItem to="/" icon={Home} label="Dashboard" collapsed={!open} />
            <NavItem to="/explore" icon={BarChart} label="Explore Stocks" collapsed={!open} />
            <NavItem to="/wishlist" icon={Bookmark} label="Wishlist" collapsed={!open} />
            <NavItem to="/leaderboard" icon={Users} label="Leaderboard" collapsed={!open} />
            <NavItem to="/history" icon={History} label="Transaction History" collapsed={!open} />
            <NavItem to="/news" icon={Newspaper} label="Latest News" collapsed={!open} />
            <NavItem to="/learn" icon={MessageSquare} label="StalkX Chat" collapsed={!open} />
          </div>
        </SidebarContent>
      </Sidebar>
      
      {isMobile && (
        <SidebarTrigger className="fixed bottom-4 left-4 z-50 rounded-full bg-stalkx-500 p-2 shadow-lg md:hidden" />
      )}
    </div>
  );
};

export default SideNavigation;
