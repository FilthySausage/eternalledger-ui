import React from 'react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Heart, Skull, Clock, AlertTriangle } from 'lucide-react';

export type LifeStatus = 'alive' | 'deceased' | 'pending' | 'unknown';

interface StatusBadgeProps {
  status: LifeStatus;
  quorum?: number; // For pending status, show quorum progress
  maxQuorum?: number;
  className?: string;
}

export function StatusBadge({ status, quorum = 0, maxQuorum = 3, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'alive':
        return {
          label: 'Alive',
          icon: Heart,
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100'
        };
      case 'deceased':
        return {
          label: 'Deceased (SDT Issued)',
          icon: Skull,
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-100'
        };
      case 'pending':
        return {
          label: 'Pending Verification',
          icon: Clock,
          variant: 'secondary' as const,
          className: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100'
        };
      default:
        return {
          label: 'Status Unknown',
          icon: AlertTriangle,
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`space-y-2 ${className}`}>
      <Badge className={`inline-flex items-center gap-1.5 ${config.className}`}>
        <Icon className="size-3" />
        {config.label}
      </Badge>
      
      {status === 'pending' && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Verification Quorum</span>
            <span>{quorum}/{maxQuorum}</span>
          </div>
          <Progress 
            value={(quorum / maxQuorum) * 100} 
            className="h-2"
          />
        </div>
      )}
    </div>
  );
}