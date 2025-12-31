'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { formatNaira, formatPercentage, getTotalInvestmentsValue, getInvestmentsByType, getInvestableCash, getExpenseReserve, getMonthlyExpenseTotal } from '@/lib/calculations';
import { investmentProducts, investmentTypeLabels, investmentTypeColors, riskLevelColors } from '@/lib/personas';
import { InvestmentProduct, InvestmentVehicle, InvestmentType } from '@/lib/types';
import { 
  TrendingUp, 
  Plus, 
  X, 
  Wallet,
  PiggyBank,
  BarChart3,
  Clock,
  ArrowUpRight,
  Banknote
} from 'lucide-react';
import clsx from 'clsx';

export default function InvestmentsPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showLiquidateModal, setShowLiquidateModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentVehicle | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const activeInvestments = (store.investments || []).filter(i => i.isActive);
  const liquidatedInvestments = (store.investments || []).filter(i => !i.isActive);
  const additionalInvestmentsValue = getTotalInvestmentsValue(store);
  const investmentsByType = getInvestmentsByType(store);
  const additionalPrincipal = activeInvestments.reduce((sum, i) => sum + i.principal, 0);
  const additionalReturns = additionalInvestmentsValue - additionalPrincipal;
  
  // Total includes money market (default) + additional investments
  const totalInvestedValue = store.moneyMarketBalance + additionalInvestmentsValue;
  
  // Calculate investable cash (excluding expense reserve)
  const expenseReserve = getExpenseReserve(store);
  const investableCash = getInvestableCash(store);
  const monthlyExpenses = getMonthlyExpenseTotal(store);

  const handleLiquidate = (investment: InvestmentVehicle) => {
    setSelectedInvestment(investment);
    setShowLiquidateModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Investments</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Manage fund investments across different vehicles
          </p>
        </div>
        <button
          onClick={() => setShowInvestModal(true)}
          className="btn-primary flex items-center gap-2"
          disabled={investableCash < 50_000}
        >
          <Plus className="w-4 h-4" />
          New Investment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 border-(--color-accent)/30 glow-accent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-(--color-accent)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Total Invested</p>
              <p className="text-xl font-bold text-(--color-accent) mono">
                {formatNaira(totalInvestedValue)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-success)/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-(--color-success)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Money Market</p>
              <p className="text-xl font-bold text-(--color-success) mono">
                {formatNaira(store.moneyMarketBalance)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
              <PiggyBank className="w-5 h-5 text-(--color-gold)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Other Investments</p>
              <p className="text-xl font-bold text-(--color-text) mono">
                {formatNaira(additionalInvestmentsValue)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-(--color-info)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-secondary)">Add. Returns</p>
              <p className={clsx(
                'text-xl font-bold mono',
                additionalReturns >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
              )}>
                {additionalReturns >= 0 ? '+' : ''}{formatNaira(additionalReturns)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Default Money Market Investment */}
      {store.moneyMarketBalance > 0 && (
        <div className="card p-6 border-(--color-success)/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-(--color-text)">Default Money Market</h3>
              <p className="text-sm text-(--color-text-muted)">
                All contributions are automatically invested here
              </p>
            </div>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="p-4 rounded-xl bg-(--color-primary-dark) border border-(--color-success)/20">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-(--color-success)" />
                  <span className="text-xs text-(--color-text-muted)">Money Market Fund</span>
                </div>
                <h4 className="font-semibold text-(--color-text)">AXA Mansard MMF (Default)</h4>
                <p className="text-xs text-(--color-text-muted) mt-1">
                  Low-risk money market fund. All member contributions flow here automatically.
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-(--color-success)">
                  {formatPercentage(store.moneyMarketRate)}
                </p>
                <p className="text-xs text-(--color-text-muted)">p.a.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t border-(--color-border)">
              <div>
                <p className="text-xs text-(--color-text-muted)">Total Balance</p>
                <p className="text-lg font-bold text-(--color-text) mono">
                  {formatNaira(store.moneyMarketBalance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--color-text-muted)">Reserved for Expenses</p>
                <p className="text-sm font-semibold text-(--color-warning) mono">
                  {formatNaira(expenseReserve)}
                </p>
                <p className="text-xs text-(--color-text-muted)">({formatNaira(monthlyExpenses)}/mo)</p>
              </div>
              <div>
                <p className="text-xs text-(--color-text-muted)">Available to Invest</p>
                <p className="text-lg font-bold text-(--color-accent) mono">
                  {formatNaira(investableCash)}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--color-text-muted)">Monthly Interest</p>
                <p className="text-sm font-semibold text-(--color-success) mono">
                  +{formatNaira(store.moneyMarketBalance * (store.moneyMarketRate / 12))}
                </p>
              </div>
              <div>
                <p className="text-xs text-(--color-text-muted)">Risk Level</p>
                <span className="badge" style={{ backgroundColor: '#10B98120', color: '#10B981' }}>
                  Low Risk
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Investment Breakdown by Type */}
      {Object.keys(investmentsByType).length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-(--color-text) mb-4">Additional Investments Breakdown</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(investmentsByType).map(([type, data]) => (
              <div
                key={type}
                className="p-4 rounded-xl bg-(--color-primary-dark)"
                style={{ borderLeft: `3px solid ${investmentTypeColors[type as InvestmentType]}` }}
              >
                <p className="text-xs text-(--color-text-muted)">
                  {investmentTypeLabels[type as InvestmentType]}
                </p>
                <p className="text-lg font-bold text-(--color-text) mono mt-1">
                  {formatNaira(data.value)}
                </p>
                <p className="text-xs text-(--color-text-secondary)">
                  {data.count} {data.count === 1 ? 'investment' : 'investments'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Investments */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-(--color-border)">
          <h3 className="text-lg font-semibold text-(--color-text)">Additional Investments</h3>
          <p className="text-sm text-(--color-text-muted) mt-1">
            {activeInvestments.length} {activeInvestments.length === 1 ? 'investment' : 'investments'} beyond the default money market
          </p>
        </div>

        {activeInvestments.length === 0 ? (
          <div className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-(--color-text-muted) mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">No additional investments yet</p>
            <p className="text-sm text-(--color-text-muted) mt-1">
              Allocate cash from the money market to other investment vehicles
            </p>
            <button
              onClick={() => setShowInvestModal(true)}
              className="btn-primary mt-4"
              disabled={investableCash < 50_000}
            >
              Allocate to Other Investments
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {activeInvestments.map((investment) => {
              const profit = investment.currentValue - investment.principal;
              const profitPct = (profit / investment.principal) * 100;
              const holdingMonths = store.currentMonth - investment.startMonth;

              return (
                <div
                  key={investment.id}
                  className="p-4 rounded-xl bg-(--color-primary-dark) border border-(--color-border) hover:border-(--color-accent)/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: investmentTypeColors[investment.type] }}
                        />
                        <span className="text-xs text-(--color-text-muted)">
                          {investmentTypeLabels[investment.type]}
                        </span>
                      </div>
                      <h4 className="font-semibold text-(--color-text)">{investment.name}</h4>
                    </div>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${riskLevelColors[investment.riskLevel]}20`,
                        color: riskLevelColors[investment.riskLevel],
                      }}
                    >
                      {investment.riskLevel}
                    </span>
                  </div>

                  <p className="text-xs text-(--color-text-muted) mb-4 line-clamp-2">
                    {investment.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-(--color-text-secondary)">Principal</span>
                      <span className="mono text-(--color-text)">{formatNaira(investment.principal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-(--color-text-secondary)">Current Value</span>
                      <span className="mono font-semibold text-(--color-accent)">
                        {formatNaira(investment.currentValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-(--color-text-secondary)">Return</span>
                      <span className={clsx(
                        'mono',
                        profit >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
                      )}>
                        {profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-(--color-text-secondary)">Expected p.a.</span>
                      <span className="mono text-(--color-gold)">
                        {formatPercentage(investment.annualReturnRate)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-(--color-text-muted)">Held for</span>
                      <span className="text-(--color-text-secondary)">{holdingMonths} months</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLiquidate(investment)}
                    className="btn-secondary w-full mt-4"
                  >
                    Liquidate
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Liquidated Investments */}
      {liquidatedInvestments.length > 0 && (
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-(--color-border)">
            <h3 className="text-lg font-semibold text-(--color-text)">Liquidated Investments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Investment</th>
                  <th>Type</th>
                  <th className="text-right">Principal</th>
                  <th className="text-right">Final Value</th>
                  <th className="text-right">Return</th>
                </tr>
              </thead>
              <tbody>
                {liquidatedInvestments.map((investment) => {
                  const profit = investment.currentValue - investment.principal;
                  const profitPct = (profit / investment.principal) * 100;
                  return (
                    <tr key={investment.id}>
                      <td className="font-medium text-(--color-text)">{investment.name}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: `${investmentTypeColors[investment.type]}20`,
                            color: investmentTypeColors[investment.type],
                          }}
                        >
                          {investmentTypeLabels[investment.type]}
                        </span>
                      </td>
                      <td className="text-right mono">{formatNaira(investment.principal)}</td>
                      <td className="text-right mono">{formatNaira(investment.currentValue)}</td>
                      <td className={clsx(
                        'text-right mono font-medium',
                        profit >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
                      )}>
                        {profit >= 0 ? '+' : ''}{formatNaira(profit)} ({profitPct.toFixed(1)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invest Modal */}
      {showInvestModal && (
        <InvestModal
          availableCash={investableCash}
          expenseReserve={expenseReserve}
          onClose={() => setShowInvestModal(false)}
        />
      )}

      {/* Liquidate Modal */}
      {showLiquidateModal && selectedInvestment && (
        <LiquidateModal
          investment={selectedInvestment}
          onClose={() => {
            setShowLiquidateModal(false);
            setSelectedInvestment(null);
          }}
        />
      )}
    </div>
  );
}

function InvestModal({ availableCash, expenseReserve, onClose }: { availableCash: number; expenseReserve: number; onClose: () => void }) {
  const { invest } = useFundStore();
  const [selectedProduct, setSelectedProduct] = useState<InvestmentProduct | null>(null);
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && amount) {
      const amountNum = parseFloat(amount);
      if (amountNum >= selectedProduct.minInvestment && amountNum <= availableCash) {
        invest(selectedProduct, amountNum);
        onClose();
      }
    }
  };

  const amountNum = parseFloat(amount) || 0;
  const isValidAmount = selectedProduct 
    ? amountNum >= selectedProduct.minInvestment && amountNum <= availableCash
    : false;

  // Group products by type
  const productsByType = investmentProducts.reduce((acc, product) => {
    if (!acc[product.type]) {
      acc[product.type] = [];
    }
    acc[product.type].push(product);
    return acc;
  }, {} as Record<InvestmentType, InvestmentProduct[]>);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6 max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-(--color-text)">New Investment</h2>
          <button onClick={onClose} className="text-(--color-text-muted) hover:text-(--color-text)">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 rounded-lg bg-(--color-info)/10 border border-(--color-info)/30 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-(--color-info)" />
              <p className="text-sm text-(--color-text)">
                Available to Invest: <span className="font-semibold mono">{formatNaira(availableCash)}</span>
              </p>
            </div>
            {expenseReserve > 0 && (
              <p className="text-xs text-(--color-text-muted)">
                ({formatNaira(expenseReserve)} reserved for expenses)
              </p>
            )}
          </div>
        </div>

        {/* Product Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-(--color-text-secondary) mb-3">
            Select Investment Product
          </label>
          <div className="space-y-4">
            {Object.entries(productsByType).map(([type, products]) => (
              <div key={type}>
                <p className="text-xs font-medium text-(--color-text-muted) uppercase tracking-wider mb-2">
                  {investmentTypeLabels[type as InvestmentType]}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {products.map((product) => (
                    <button
                      key={product.name}
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className={clsx(
                        'p-4 rounded-lg border text-left transition-all',
                        selectedProduct?.name === product.name
                          ? 'border-(--color-accent) bg-(--color-accent)/10'
                          : 'border-(--color-border) bg-(--color-primary-dark) hover:border-(--color-text-muted)'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-(--color-text)">{product.name}</h4>
                            <span
                              className="badge text-xs"
                              style={{
                                backgroundColor: `${riskLevelColors[product.riskLevel]}20`,
                                color: riskLevelColors[product.riskLevel],
                              }}
                            >
                              {product.riskLevel} risk
                            </span>
                          </div>
                          <p className="text-xs text-(--color-text-muted) mt-1">{product.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-lg font-bold text-(--color-accent)">
                            {formatPercentage(product.annualReturnRate)}
                          </p>
                          <p className="text-xs text-(--color-text-muted)">p.a.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-(--color-text-secondary)">
                        <span className="flex items-center gap-1">
                          <Banknote className="w-3 h-3" />
                          Min: {formatNaira(product.minInvestment)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {product.liquidityDays <= 1 ? 'Instant' : `${product.liquidityDays} days`} liquidity
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        {selectedProduct && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                Investment Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={clsx('input mono', !isValidAmount && amount && 'border-(--color-danger)')}
                min={selectedProduct.minInvestment}
                max={availableCash}
                step="105000"
                placeholder={`Min: ${formatNaira(selectedProduct.minInvestment)}`}
                required
              />
              {!isValidAmount && amount && (
                <p className="text-xs text-(--color-danger) mt-1">
                  {amountNum < selectedProduct.minInvestment
                    ? `Minimum investment is ${formatNaira(selectedProduct.minInvestment)}`
                    : 'Insufficient funds'}
                </p>
              )}
            </div>

            {/* Expected Returns Preview */}
            {isValidAmount && (
              <div className="p-4 rounded-lg bg-(--color-surface-elevated) mb-6">
                <h4 className="text-sm font-medium text-(--color-text-secondary) mb-2">Expected Returns</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-(--color-text-muted)">1 Year</p>
                    <p className="text-sm font-semibold text-(--color-success) mono">
                      +{formatNaira(amountNum * selectedProduct.annualReturnRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-muted)">5 Years</p>
                    <p className="text-sm font-semibold text-(--color-success) mono">
                      +{formatNaira(amountNum * Math.pow(1 + selectedProduct.annualReturnRate, 5) - amountNum)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-(--color-text-muted)">10 Years</p>
                    <p className="text-sm font-semibold text-(--color-success) mono">
                      +{formatNaira(amountNum * Math.pow(1 + selectedProduct.annualReturnRate, 10) - amountNum)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={!isValidAmount}
              >
                Invest {amount ? formatNaira(amountNum) : ''}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function LiquidateModal({ investment, onClose }: { investment: InvestmentVehicle; onClose: () => void }) {
  const { liquidate } = useFundStore();
  const profit = investment.currentValue - investment.principal;
  const profitPct = (profit / investment.principal) * 100;

  const handleLiquidate = () => {
    liquidate(investment.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-(--color-text)">Liquidate Investment</h2>
          <button onClick={onClose} className="text-(--color-text-muted) hover:text-(--color-text)">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-lg bg-(--color-primary-dark) mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: investmentTypeColors[investment.type] }}
            />
            <span className="text-xs text-(--color-text-muted)">
              {investmentTypeLabels[investment.type]}
            </span>
          </div>
          <h3 className="font-semibold text-(--color-text)">{investment.name}</h3>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between py-2 border-b border-(--color-border)">
            <span className="text-(--color-text-secondary)">Principal Invested</span>
            <span className="mono text-(--color-text)">{formatNaira(investment.principal)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-(--color-border)">
            <span className="text-(--color-text-secondary)">Current Value</span>
            <span className="mono font-semibold text-(--color-accent)">{formatNaira(investment.currentValue)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-(--color-text-secondary)">Profit/Loss</span>
            <span className={clsx(
              'mono font-semibold',
              profit >= 0 ? 'text-(--color-success)' : 'text-(--color-danger)'
            )}>
              {profit >= 0 ? '+' : ''}{formatNaira(profit)} ({profitPct.toFixed(1)}%)
            </span>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-(--color-info)/10 border border-(--color-info)/30 mb-6">
          <div className="flex items-start gap-2">
            <ArrowUpRight className="w-4 h-4 text-(--color-info) flex-shrink-0 mt-0.5" />
            <p className="text-sm text-(--color-text)">
              Proceeds of {formatNaira(investment.currentValue)} will be added to available cash.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleLiquidate} className="btn-primary flex-1">
            Confirm Liquidation
          </button>
        </div>
      </div>
    </div>
  );
}

