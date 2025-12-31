'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { formatNaira, getMemberBalances } from '@/lib/calculations';
import { 
  Percent,
  DollarSign,
  AlertCircle,
  Check,
  History,
  Users,
  TrendingUp,
  PiggyBank
} from 'lucide-react';

export default function DividendsPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);
  const [dividendPercentage, setDividendPercentage] = useState(20);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDividendSuccess, setShowDividendSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && store.dividendPercentage !== undefined) {
      setDividendPercentage(store.dividendPercentage * 100);
    }
  }, [mounted, store.dividendPercentage]);

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const handleSaveDividendPercentage = () => {
    const percentage = Math.min(100, Math.max(0, dividendPercentage)) / 100;
    store.setDividendPercentage(percentage);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePayDividends = () => {
    store.payDividends();
    setShowDividendSuccess(true);
    setTimeout(() => setShowDividendSuccess(false), 3000);
  };

  // Calculate current year profit for dividend preview
  const currentFiscalYear = Math.floor(store.currentMonth / 12) + 1;
  const startMonth = (currentFiscalYear - 1) * 12;
  const startSnapshot = store.monthSnapshots.find(s => s.month === startMonth);
  const startNAV = startSnapshot?.nav || 0;
  const yearContributions = store.contributions
    .filter(c => c.month > startMonth && c.month <= store.currentMonth)
    .reduce((sum, c) => sum + c.amount, 0);
  const currentProfit = store.nav - startNAV - yearContributions;
  const projectedDividend = currentProfit > 0 ? currentProfit * (dividendPercentage / 100) : 0;

  // Get member balances for dividend distribution preview
  const memberBalances = getMemberBalances(store);
  const activeBalances = memberBalances.filter(b => {
    const member = store.members.find(m => m.id === b.memberId);
    return member?.isActive && b.totalUnits > 0;
  });

  // Past dividends
  const totalDividendsPaid = (store.dividends || []).reduce((sum, d) => sum + d.distributedAmount, 0);
  const totalProfitAllTime = (store.dividends || []).reduce((sum, d) => sum + d.totalProfit, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Dividends</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Configure and distribute dividends to members
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
              <Percent className="w-5 h-5 text-(--color-gold)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-muted)">Distribution Rate</p>
              <p className="text-xl font-bold mono text-(--color-gold)">
                {((store.dividendPercentage ?? 0.20) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-(--color-accent)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-muted)">Total Distributed</p>
              <p className="text-xl font-bold mono text-(--color-accent)">
                {formatNaira(totalDividendsPaid)}
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
              <p className="text-sm text-(--color-text-muted)">Current Year Profit</p>
              <p className={`text-xl font-bold mono ${currentProfit >= 0 ? 'text-(--color-success)' : 'text-(--color-error)'}`}>
                {formatNaira(currentProfit)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-(--color-info)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-muted)">Dividends Paid</p>
              <p className="text-xl font-bold text-(--color-text)">
                {(store.dividends || []).length} times
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dividend Settings Card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
            <Percent className="w-5 h-5 text-(--color-gold)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--color-text)">Dividend Settings</h2>
            <p className="text-sm text-(--color-text-muted)">
              Configure the percentage of annual profit distributed to members
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dividend Percentage Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                Dividend Distribution Rate
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={dividendPercentage}
                    onChange={(e) => setDividendPercentage(Number(e.target.value))}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-gold) focus:outline-none focus:ring-1 focus:ring-(--color-gold) mono text-lg"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-muted)">%</span>
                </div>
                <button
                  onClick={handleSaveDividendPercentage}
                  className="px-6 py-3 rounded-xl bg-(--color-gold) text-(--color-primary-dark) font-medium hover:bg-(--color-gold)/90 transition-colors flex items-center gap-2"
                >
                  {showSuccess ? <Check className="w-5 h-5" /> : 'Save'}
                </button>
              </div>
              <p className="text-xs text-(--color-text-muted) mt-2">
                This percentage of annual profit will be distributed to members at year end. 
                The remaining {100 - dividendPercentage}% is reinvested in the fund.
              </p>
            </div>
          </div>

          {/* Dividend Preview */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-(--color-primary-dark) border border-(--color-border)">
              <p className="text-sm text-(--color-text-muted) mb-3">
                Year {currentFiscalYear} Dividend Preview
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-(--color-text-secondary)">Current Profit</span>
                  <span className={`font-semibold mono ${currentProfit >= 0 ? 'text-(--color-success)' : 'text-(--color-error)'}`}>
                    {formatNaira(currentProfit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-(--color-text-secondary)">Distribution Rate</span>
                  <span className="font-semibold mono text-(--color-gold)">
                    {dividendPercentage}%
                  </span>
                </div>
                <div className="border-t border-(--color-border) pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-(--color-text)">Projected Dividend</span>
                    <span className="text-lg font-bold mono text-(--color-accent)">
                      {formatNaira(projectedDividend)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Members Preview */}
            <div className="p-4 rounded-xl bg-(--color-surface-elevated) border border-(--color-border)">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-(--color-text-muted)" />
                <span className="text-sm text-(--color-text-muted)">Distribution Preview</span>
              </div>
              <p className="text-sm text-(--color-text-secondary)">
                {activeBalances.length} active members will receive dividends proportional to their ownership
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Dividend Payment */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-(--color-accent)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--color-text)">Pay Dividends</h2>
            <p className="text-sm text-(--color-text-muted)">
              Manually trigger dividend distribution to all members
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Available for Distribution</p>
            <p className={`text-xl font-bold mono ${currentProfit >= 0 ? 'text-(--color-success)' : 'text-(--color-text-muted)'}`}>
              {currentProfit > 0 ? formatNaira(projectedDividend) : '₦0'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Total Dividends Paid (All Time)</p>
            <p className="text-xl font-bold mono text-(--color-gold)">
              {formatNaira(totalDividendsPaid)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
            <p className="text-sm text-(--color-text-muted)">Total Profit Generated</p>
            <p className="text-xl font-bold mono text-(--color-success)">
              {formatNaira(totalProfitAllTime)}
            </p>
          </div>
        </div>

        {currentProfit <= 0 ? (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-(--color-warning)/10 border border-(--color-warning)/30">
            <AlertCircle className="w-5 h-5 text-(--color-warning) shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-(--color-warning)">No profit to distribute</p>
              <p className="text-sm text-(--color-text-muted) mt-1">
                Dividends can only be paid when there is profit. Current year profit is {formatNaira(currentProfit)}.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handlePayDividends}
              className="px-6 py-3 rounded-xl bg-(--color-accent) text-(--color-primary-dark) font-medium hover:bg-(--color-accent)/90 transition-colors flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Pay Dividends Now
            </button>
            {showDividendSuccess && (
              <div className="flex items-center gap-2 text-(--color-success)">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">Dividends distributed successfully!</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dividend History */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-(--color-border) flex items-center gap-3">
          <History className="w-5 h-5 text-(--color-text-secondary)" />
          <h3 className="text-lg font-semibold text-(--color-text)">Dividend History</h3>
        </div>

        {(store.dividends || []).length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-(--color-text-muted) mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">No dividends distributed yet</p>
            <p className="text-sm text-(--color-text-muted) mt-1">
              Dividends are distributed at the end of each fiscal year (Month 12, 24, 36...)
            </p>
          </div>
        ) : (
          <div className="divide-y divide-(--color-border)">
            {[...(store.dividends || [])].reverse().map((dividend) => (
              <div key={dividend.id} className="p-4 hover:bg-(--color-primary-dark)/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-(--color-text)">
                      Year {dividend.fiscalYear} Dividend
                    </p>
                    <p className="text-sm text-(--color-text-muted)">
                      Month {dividend.month}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold mono text-(--color-accent)">
                      {formatNaira(dividend.distributedAmount)}
                    </p>
                    <p className="text-sm text-(--color-text-muted)">
                      distributed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
                    <p className="text-(--color-text-muted)">Total Profit</p>
                    <p className="font-semibold mono text-(--color-success)">
                      {formatNaira(dividend.totalProfit)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
                    <p className="text-(--color-text-muted)">Reinvested</p>
                    <p className="font-semibold mono text-(--color-text)">
                      {formatNaira(dividend.reinvestedAmount)}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
                    <p className="text-(--color-text-muted)">Recipients</p>
                    <p className="font-semibold text-(--color-text)">
                      {dividend.distributions.length} members
                    </p>
                  </div>
                </div>

                {/* Distribution breakdown */}
                <details className="mt-3">
                  <summary className="text-sm text-(--color-text-secondary) cursor-pointer hover:text-(--color-text)">
                    View distribution breakdown
                  </summary>
                  <div className="mt-2 space-y-1">
                    {dividend.distributions.map((dist) => (
                      <div 
                        key={dist.memberId} 
                        className="flex justify-between items-center p-2 rounded-lg bg-(--color-primary-dark)"
                      >
                        <span className="text-sm text-(--color-text)">{dist.memberName}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-(--color-text-muted)">
                            {(dist.ownershipPercentage * 100).toFixed(2)}%
                          </span>
                          <span className="text-sm font-medium mono text-(--color-accent)">
                            {formatNaira(dist.dividendAmount)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

