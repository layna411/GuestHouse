import React from 'react';
import { cn } from '../utils/cn';

interface StatusChipProps {
  status: 'vacant' | 'booked' | 'maintenance' | 'confirmed' | 'pending' | 'cancelled' | 'completed';
  size?: 'sm' | 'md';
}

export function StatusChip({ status, size = 'md' }: StatusChipProps) {
  const statusConfig = {
    vacant: {
      label: 'Vacant',
      className: 'bg-success/10 text-success border-success/20',
      dotColor: 'bg-success',
    },
    booked: {
      label: 'Booked',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
      dotColor: 'bg-destructive',
    },
    maintenance: {
      label: 'Maintenance',
      className: 'bg-warning/10 text-warning border-warning/20',
      dotColor: 'bg-warning',
    },
    confirmed: {
      label: 'Confirmed',
      className: 'bg-success/10 text-success border-success/20',
      dotColor: 'bg-success',
    },
    pending: {
      label: 'Pending',
      className: 'bg-warning/10 text-warning border-warning/20',
      dotColor: 'bg-warning',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-muted/50 text-muted-foreground border-muted',
      dotColor: 'bg-muted-foreground',
    },
    completed: {
      label: 'Completed',
      className: 'bg-primary/10 text-primary border-primary/20',
      dotColor: 'bg-primary',
    },
  };

  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.className,
        sizeClasses
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      {config.label}
    </span>
  );
}
