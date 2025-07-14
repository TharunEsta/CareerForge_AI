import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUserStore } from '@/store/useUserStore';
import { Upload, Zap } from 'lucide-react';

export const UsageCounter: React.FC = () => {
  const { user, usagePercentage } = useUserStore();

  if (!user) return null;

  return (
    <div className="flex items-center justify-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10 max-w-xs">
      {/* Plan Badge */}
      <Badge 
        variant={user.plan === 'pro' ? 'default' : 'secondary'}
        className={`text-xs ${
          user.plan === 'pro' 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
            : 'bg-white/10 text-white'
        }`}
      >
        {user.plan.toUpperCase()}
      </Badge>

      {/* Usage Progress (only for free tier) */}
      {user.plan === 'free' && (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
              style={{ width: `${usagePercentage()}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {Math.round(usagePercentage())}%
          </span>
        </div>
      )}
    </div>
  );
}; 
