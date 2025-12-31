'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { formatNaira, formatPercentage, getMonthName, getMemberBalances } from '@/lib/calculations';
import { MonthSnapshot, Contribution, Member } from '@/lib/types';
import { 
  PlayCircle, 
  FastForward, 
  SkipForward,
  Calendar,
  TrendingUp,
  Coins,
  Users,
  ChevronDown,
  ChevronUp,
  History
} from 'lucide-react';
import clsx from 'clsx';

export default function SimulationPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const handleAdvanceMonth = () => {
    store.advanceMonth();
  };

  const handleAdvanceMonths = (count: number) => {
    store.advanceMonths(count);
  };

  const handleAdvanceYears = (count: number) => {
    store.advanceYears(count);
  };

  const toggleMonth = (month: number) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Simulation</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Advance time and watch the fund grow
          </p>
        </div>
      </div>

      {/* Current State */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-(--color-text-secondary)">Current Period</p>
            <p className="text-2xl font-bold text-(--color-text)">
              {getMonthName(store.currentMonth, new Date(store.startDate))}
            </p>
            <p className="text-sm text-(--color-text-muted)">Month {store.currentMonth}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-(--color-text-secondary)">Net Asset Value</p>
            <p className="text-2xl font-bold text-(--color-accent) mono">{formatNaira(store.nav)}</p>
            <p className="text-sm text-(--color-gold)">
              Unit Price: ₦{store.unitPrice.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleAdvanceMonth}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-(--color-primary-dark) border border-(--color-border) hover:border-(--color-accent)/50 transition-all hover:scale-[1.02]"
          >
            <PlayCircle className="w-8 h-8 text-(--color-accent)" />
            <span className="font-medium text-(--color-text)">+1 Month</span>
          </button>
          <button
            onClick={() => handleAdvanceMonths(3)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-(--color-primary-dark) border border-(--color-border) hover:border-(--color-accent)/50 transition-all hover:scale-[1.02]"
          >
            <FastForward className="w-8 h-8 text-(--color-accent)" />
            <span className="font-medium text-(--color-text)">+3 Months</span>
          </button>
          <button
            onClick={() => handleAdvanceMonths(6)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-(--color-primary-dark) border border-(--color-border) hover:border-(--color-gold)/50 transition-all hover:scale-[1.02]"
          >
            <FastForward className="w-8 h-8 text-(--color-gold)" />
            <span className="font-medium text-(--color-text)">+6 Months</span>
          </button>
          <button
            onClick={() => handleAdvanceYears(1)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-(--color-primary-dark) border border-(--color-border) hover:border-(--color-gold)/50 transition-all hover:scale-[1.02]"
          >
            <SkipForward className="w-8 h-8 text-(--color-gold)" />
            <span className="font-medium text-(--color-text)">+1 Year</span>
          </button>
        </div>

        {/* Quick Forward Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-(--color-border)">
          <span className="text-sm text-(--color-text-muted) py-1">Fast forward:</span>
          {[2, 5, 10, 20, 30].map((years) => (
            <button
              key={years}
              onClick={() => handleAdvanceYears(years)}
              className="px-3 py-1 rounded-lg text-sm bg-(--color-surface-elevated) text-(--color-text-secondary) hover:text-(--color-text) hover:bg-(--color-border) transition-colors"
            >
              {years} years
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-(--color-accent)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Years Elapsed</p>
              <p className="text-xl font-bold text-(--color-text)">
                {(store.currentMonth / 12).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-(--color-gold)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Total Units</p>
              <p className="text-xl font-bold text-(--color-text) mono">
                {store.totalUnits.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-success)/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Unit Growth</p>
              <p className="text-xl font-bold text-(--color-success) mono">
                +{(((store.unitPrice - store.initialUnitPrice) / store.initialUnitPrice) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-(--color-info)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Active Members</p>
              <p className="text-xl font-bold text-(--color-text)">
                {store.members.filter(m => m.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Month History */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-(--color-border) flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-(--color-text-secondary)" />
            <h3 className="text-lg font-semibold text-(--color-text)">Month History</h3>
          </div>
          <span className="text-sm text-(--color-text-muted)">
            {store.monthSnapshots.length} months recorded
          </span>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {store.monthSnapshots.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-(--color-text-muted) mx-auto mb-4" />
              <p className="text-(--color-text-secondary)">No history yet</p>
              <p className="text-sm text-(--color-text-muted) mt-1">
                Advance the simulation to see monthly snapshots
              </p>
            </div>
          ) : (
            <div className="divide-y divide-(--color-border)">
              {[...store.monthSnapshots].reverse().map((snapshot) => (
                <MonthRow
                  key={snapshot.month}
                  snapshot={snapshot}
                  members={store.members}
                  startDate={new Date(store.startDate)}
                  isExpanded={expandedMonth === snapshot.month}
                  onToggle={() => toggleMonth(snapshot.month)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MonthRow({
  snapshot,
  members,
  startDate,
  isExpanded,
  onToggle,
}: {
  snapshot: MonthSnapshot;
  members: Member[];
  startDate: Date;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const getMemberName = (id: string) => members.find(m => m.id === id)?.name || 'Unknown';

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-(--color-primary-dark)/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-(--color-surface-elevated) flex items-center justify-center">
            <span className="text-lg font-bold text-(--color-accent)">{snapshot.month}</span>
          </div>
          <div className="text-left">
            <p className="font-medium text-(--color-text)">
              {getMonthName(snapshot.month, startDate)}
            </p>
            <p className="text-sm text-(--color-text-muted)">
              {snapshot.contributions.length} contributions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-(--color-text-secondary)">NAV</p>
            <p className="font-semibold text-(--color-text) mono">{formatNaira(snapshot.nav)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-(--color-text-secondary)">Unit Price</p>
            <p className="font-semibold text-(--color-accent) mono">₦{snapshot.unitPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-(--color-text-secondary)">Interest</p>
            <p className="font-semibold text-(--color-success) mono">+{formatNaira(snapshot.interestEarned)}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-(--color-text-muted)" />
          ) : (
            <ChevronDown className="w-5 h-5 text-(--color-text-muted)" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 bg-(--color-primary-dark)/30">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-(--color-surface) border border-(--color-accent)/30">
              <p className="text-xs text-(--color-text-muted)">Total Contributions</p>
              <p className="font-semibold text-(--color-accent) mono">
                {formatNaira(snapshot.contributions.reduce((sum, c) => sum + c.amount, 0))}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-(--color-surface)">
              <p className="text-xs text-(--color-text-muted)">Money Market</p>
              <p className="font-semibold text-(--color-text) mono">{formatNaira(snapshot.moneyMarketValue)}</p>
            </div>
            <div className="p-3 rounded-lg bg-(--color-surface)">
              <p className="text-xs text-(--color-text-muted)">Land Value</p>
              <p className="font-semibold text-(--color-text) mono">{formatNaira(snapshot.landValue)}</p>
            </div>
          </div>

          {snapshot.contributions.length > 0 && (
            <div>
              <p className="text-sm font-medium text-(--color-text-secondary) mb-2">Contributions Breakdown</p>
              <div className="space-y-2">
                {snapshot.contributions.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-(--color-surface)"
                  >
                    <span className="text-sm text-(--color-text)">{getMemberName(c.memberId)}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm mono text-(--color-text)">{formatNaira(c.amount)}</span>
                      <span className="text-xs mono text-(--color-text-muted)">
                        {c.unitsIssued.toFixed(2)} units
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {snapshot.events.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-(--color-text-secondary) mb-2">Events</p>
              <div className="space-y-2">
                {snapshot.events.map((event) => (
                  <div
                    key={event.id}
                    className="p-2 rounded-lg bg-(--color-surface) text-sm text-(--color-text)"
                  >
                    {event.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

