import { cn } from '../../utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text, className }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-accent-200 border-t-accent-600', sizeClasses[size])} />
      {text && (
        <span className="text-primary-600 text-sm font-medium">{text}</span>
      )}
    </div>
  );
}

interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn('loading-dots', className)}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'loading-skeleton h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('card p-6', className)}>
      <div className="space-y-4">
        <div className="loading-skeleton h-6 w-2/3" />
        <div className="loading-skeleton h-4 w-full" />
        <div className="loading-skeleton h-4 w-5/6" />
        <div className="flex space-x-2 mt-4">
          <div className="loading-skeleton h-6 w-16 rounded-full" />
          <div className="loading-skeleton h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
