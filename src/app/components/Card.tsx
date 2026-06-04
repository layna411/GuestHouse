import React from 'react';
import { cn } from '../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glass = false, hoverable = false, onClick }: CardProps) {
  const baseStyles = 'rounded-xl border border-border transition-all duration-200';
  const glassStyles = glass
    ? 'backdrop-blur-md bg-card/80 shadow-lg'
    : 'bg-card shadow-sm';
  const hoverStyles = hoverable ? 'hover:shadow-xl hover:scale-[1.02] cursor-pointer' : '';

  return (
    <div
      className={cn(baseStyles, glassStyles, hoverStyles, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pb-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('font-medium text-card-foreground', className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pt-0', className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('p-6 pt-4 flex items-center gap-3', className)}>{children}</div>;
}
