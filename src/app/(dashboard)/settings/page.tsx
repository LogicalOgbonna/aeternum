'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { formatNaira, formatPercentage } from '@/lib/calculations';
import Link from 'next/link';
import { 
  Settings,
  DollarSign,
  Receipt,
  RefreshCcw,
  AlertTriangle,
  Check,
  Building2,
  Calendar,
  ChevronRight
} from 'lucide-react';

export default function SettingsPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const handleResetFund = () => {
    store.resetFund();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Settings</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Configure fund parameters and manage simulation
          </p>
        </div>
      </div>

      {/* Fund Info */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-(--color-accent)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--color-text)">Fund Information</h2>
            <p className="text-sm text-(--color-text-muted)">
              Basic fund details and current state
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Fund Name</p>
            <p className="text-lg font-semibold text-(--color-text)">{store.fundName}</p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Current Month</p>
            <p className="text-lg font-semibold text-(--color-text)">{store.currentMonth}</p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Initial Unit Price</p>
            <p className="text-lg font-semibold mono text-(--color-text)">₦{store.initialUnitPrice.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Current Unit Price</p>
            <p className="text-lg font-semibold mono text-(--color-accent)">₦{store.unitPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dividends" className="card p-6 hover:border-(--color-gold)/50 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--color-gold)/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-(--color-gold)" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-(--color-text)">Dividends</h3>
                <p className="text-sm text-(--color-text-muted)">
                  Configure dividend rate: {((store.dividendPercentage ?? 0.20) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-(--color-text-muted) group-hover:text-(--color-gold) transition-colors" />
          </div>
        </Link>

        <Link href="/expenses" className="card p-6 hover:border-(--color-error)/50 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-(--color-error)/10 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-(--color-error)" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-(--color-text)">Expenses</h3>
                <p className="text-sm text-(--color-text-muted)">
                  {(store.expenseSettings || []).filter(e => e.isActive).length} active expense items
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-(--color-text-muted) group-hover:text-(--color-error) transition-colors" />
          </div>
        </Link>
      </div>

      {/* Fund Parameters */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-(--color-info)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--color-text)">Fund Parameters</h2>
            <p className="text-sm text-(--color-text-muted)">
              Current fund configuration settings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Money Market Rate</p>
            <p className="text-lg font-semibold mono text-(--color-success)">
              {formatPercentage(store.moneyMarketRate)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Liquidity Pool</p>
            <p className="text-lg font-semibold mono text-(--color-text)">
              {formatPercentage(store.liquidityPoolPercentage)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Default Penalty Rate</p>
            <p className="text-lg font-semibold mono text-(--color-warning)">
              {formatPercentage(store.defaultPenaltyRate)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Lock-in Period</p>
            <p className="text-lg font-semibold text-(--color-text)">
              {store.lockInPeriodMonths} months
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-(--color-error)/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-(--color-error)/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-(--color-error)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--color-text)">Danger Zone</h2>
            <p className="text-sm text-(--color-text-muted)">
              These actions cannot be undone
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-(--color-error)/5 border border-(--color-error)/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-(--color-text)">Reset Simulation</p>
              <p className="text-sm text-(--color-text-muted)">
                Reset all fund data to initial state. This will clear all contributions, investments, and history.
              </p>
            </div>
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-lg text-(--color-text-secondary) hover:bg-(--color-surface-elevated) transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetFund}
                  className="px-4 py-2 rounded-lg bg-(--color-error) text-white font-medium hover:bg-(--color-error)/90 transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirm Reset
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-4 py-2 rounded-lg border border-(--color-error) text-(--color-error) font-medium hover:bg-(--color-error)/10 transition-colors flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Reset Fund
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

