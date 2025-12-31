'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { formatNaira, getMonthName } from '@/lib/calculations';
import { Calendar, RefreshCw, Wallet } from 'lucide-react';

export function Header() {
  const { currentMonth, startDate, nav, unitPrice, isInitialized, initializeFund, resetFund, _hasHydrated } = useFundStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for hydration to complete before initializing
  useEffect(() => {
    if (_hasHydrated && !isInitialized) {
      initializeFund();
    }
  }, [_hasHydrated, isInitialized, initializeFund]);

  if (!mounted || !_hasHydrated) {
    return (
      <header className="h-16 border-b border-(--color-border) bg-(--color-surface) px-6 flex items-center justify-between">
        <div className="animate-pulse flex items-center gap-4">
          <div className="h-4 w-32 bg-(--color-surface-elevated) rounded" />
        </div>
      </header>
    );
  }

  const monthName = getMonthName(currentMonth, new Date(startDate));
  
  // Format elapsed time as years and months
  const yearsElapsed = Math.floor(currentMonth / 12);
  const monthsRemaining = currentMonth % 12;
  let elapsedStr = '';
  if (yearsElapsed > 0 && monthsRemaining > 0) {
    elapsedStr = `${yearsElapsed}y ${monthsRemaining}m`;
  } else if (yearsElapsed > 0) {
    elapsedStr = `${yearsElapsed} year${yearsElapsed > 1 ? 's' : ''}`;
  } else {
    elapsedStr = `${currentMonth} month${currentMonth !== 1 ? 's' : ''}`;
  }

  return (
    <header className="h-16 border-b border-(--color-border) bg-(--color-surface) px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Current Period */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-(--color-accent)" />
          <span className="text-sm text-(--color-text-secondary)">Current Period:</span>
          <span className="font-semibold text-(--color-text)">{monthName}</span>
          <span className="text-xs text-(--color-text-muted)">({elapsedStr})</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-(--color-gold)" />
          <span className="text-sm text-(--color-text-secondary)">NAV:</span>
          <span className="font-semibold text-(--color-text) mono">{formatNaira(nav)}</span>
        </div>
        
        <div className="h-6 w-px bg-(--color-border)" />
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-(--color-text-secondary)">Unit Price:</span>
          <span className="font-semibold text-(--color-accent) mono">₦{unitPrice.toFixed(2)}</span>
        </div>

        <div className="h-6 w-px bg-(--color-border)" />

        <button
          onClick={resetFund}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-(--color-text-secondary) hover:bg-(--color-surface-elevated) hover:text-(--color-text) transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </header>
  );
}

