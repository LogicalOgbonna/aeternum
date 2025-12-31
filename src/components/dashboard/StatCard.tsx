'use client';

import { ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'accent' | 'gold' | 'success';
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const variantStyles = {
    default: 'border-(--color-border)',
    accent: 'border-(--color-accent)/30 glow-accent',
    gold: 'border-(--color-gold)/30 glow-gold',
    success: 'border-(--color-success)/30 glow-success',
  };

  const iconBgStyles = {
    default: 'bg-(--color-surface-elevated)',
    accent: 'bg-(--color-accent)/10',
    gold: 'bg-(--color-gold)/10',
    success: 'bg-(--color-success)/10',
  };

  const iconColorStyles = {
    default: 'text-(--color-text-secondary)',
    accent: 'text-(--color-accent)',
    gold: 'text-(--color-gold)',
    success: 'text-(--color-success)',
  };

  return (
    <div
      className={clsx(
        'card p-5 transition-all duration-300 hover:scale-[1.02]',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={clsx(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            iconBgStyles[variant]
          )}
        >
          <div className={iconColorStyles[variant]}>{icon}</div>
        </div>
        {trend && (
          <div
            className={clsx(
              'flex items-center gap-1 text-sm font-medium',
              trend.value >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
            )}
          >
            <span>{trend.value >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value).toFixed(2)}%</span>
          </div>
        )}
      </div>

      <p className="text-sm text-(--color-text-secondary) mb-1">{title}</p>
      <p className="text-2xl font-bold text-(--color-text) mono">{value}</p>
      {subtitle && (
        <p className="text-xs text-(--color-text-muted) mt-1">{subtitle}</p>
      )}
    </div>
  );
}


