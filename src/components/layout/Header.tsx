'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { formatNaira, getMonthName } from '@/lib/calculations';
import { Calendar, RefreshCw, Wallet, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
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
      <header className="h-16 border-b border-(--color-border) bg-(--color-surface) px-4 sm:px-6 flex items-center justify-between">
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
    <header className="h-auto min-h-16 border-b border-(--color-border) bg-(--color-surface) px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
      {/* Left section with menu button and current period */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-(--color-surface-elevated) text-(--color-text-secondary)"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-(--color-accent) hidden sm:block" />
          <span className="text-sm text-(--color-text-secondary) hidden sm:inline">Current Period:</span>
          <span className="font-semibold text-(--color-text) text-sm sm:text-base">{monthName}</span>
          <span className="text-xs text-(--color-text-muted) hidden sm:inline">({elapsedStr})</span>
        </div>
      </div>

      {/* Right section with stats */}
      <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-(--color-gold) hidden sm:block" />
          <span className="text-xs sm:text-sm text-(--color-text-secondary)">NAV:</span>
          <span className="font-semibold text-(--color-text) mono text-xs sm:text-sm">{formatNaira(nav)}</span>
        </div>
        
        <div className="h-6 w-px bg-(--color-border) hidden sm:block" />
        
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-(--color-text-secondary) hidden xs:inline">Unit:</span>
          <span className="font-semibold text-(--color-accent) mono text-xs sm:text-sm">₦{unitPrice.toFixed(2)}</span>
        </div>

        <div className="h-6 w-px bg-(--color-border) hidden sm:block" />

        <button
          onClick={resetFund}
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm text-(--color-text-secondary) hover:bg-(--color-surface-elevated) hover:text-(--color-text) transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
