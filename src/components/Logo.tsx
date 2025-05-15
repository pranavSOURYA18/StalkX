
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = '', size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizeClasses[size]} ${className}`}>
      <TrendingUp className="text-stalkx-500" />
      <span>StalkX</span>
      <span className="text-xs font-normal text-muted-foreground mt-1">stalk your stocks</span>
    </div>
  );
};

export default Logo;
