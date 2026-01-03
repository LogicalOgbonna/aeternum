'use client';

import { SimulationEvent } from '@/lib/types';
import { 
  UserPlus, 
  UserMinus, 
  MapPin, 
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  Repeat
} from 'lucide-react';
import clsx from 'clsx';

interface RecentActivityProps {
  events: SimulationEvent[];
  maxItems?: number;
}

const eventIcons: Record<SimulationEvent['type'], typeof UserPlus> = {
  member_joined: UserPlus,
  member_exited: UserMinus,
  member_defaulted: AlertTriangle,
  land_purchased: MapPin,
  land_sold: TrendingUp,
  dividend_paid: DollarSign,
  emergency_withdrawal: AlertTriangle,
  investment_made: BarChart3,
  investment_liquidated: ArrowUpRight,
  shares_buyback: Repeat,
};

const eventColors: Record<SimulationEvent['type'], string> = {
  member_joined: 'text-(--color-success) bg-(--color-success)/10',
  member_exited: 'text-(--color-warning) bg-(--color-warning)/10',
  member_defaulted: 'text-(--color-danger) bg-(--color-danger)/10',
  land_purchased: 'text-(--color-accent) bg-(--color-accent)/10',
  land_sold: 'text-(--color-gold) bg-(--color-gold)/10',
  dividend_paid: 'text-(--color-gold) bg-(--color-gold)/10',
  emergency_withdrawal: 'text-(--color-danger) bg-(--color-danger)/10',
  investment_made: 'text-(--color-accent) bg-(--color-accent)/10',
  investment_liquidated: 'text-(--color-gold) bg-(--color-gold)/10',
  shares_buyback: 'text-(--color-accent) bg-(--color-accent)/10',
};

export function RecentActivity({ events, maxItems = 5 }: RecentActivityProps) {
  const recentEvents = events.slice(-maxItems).reverse();

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-(--color-text) mb-4">Recent Activity</h3>
      
      {recentEvents.length === 0 ? (
        <div className="py-6 sm:py-8 text-center">
          <p className="text-(--color-text-muted) text-sm">No events yet</p>
          <p className="text-xs sm:text-sm text-(--color-text-muted) mt-1">
            Events will appear as you run the simulation
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {recentEvents.map((event) => {
            const Icon = eventIcons[event.type];
            return (
              <div
                key={event.id}
                className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-(--color-primary-dark)/50 hover:bg-(--color-primary-dark) transition-colors"
              >
                <div
                  className={clsx(
                    'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                    eventColors[event.type]
                  )}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-(--color-text) line-clamp-2">{event.description}</p>
                  <p className="text-xs text-(--color-text-muted) mt-1">
                    Month {event.month}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
