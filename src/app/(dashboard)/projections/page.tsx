'use client';

import { useEffect, useState, useMemo } from 'react';
import { useFundStore } from '@/lib/store';
import { generateProjection, formatNaira, formatPercentage } from '@/lib/calculations';
import { ProjectionResult } from '@/lib/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Calendar,
  DollarSign,
  Users,
  MapPin
} from 'lucide-react';
import clsx from 'clsx';

export default function ProjectionsPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);
  const [projectionYears, setProjectionYears] = useState(10);
  const [showProjection, setShowProjection] = useState(false);
  const [projectionData, setProjectionData] = useState<ProjectionResult[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const runProjection = () => {
    const results = generateProjection(store, projectionYears);
    setProjectionData(results);
    setShowProjection(true);
  };

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const finalResult = projectionData[projectionData.length - 1];
  const totalContributions = store.contributions.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Projections</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Forecast future fund growth based on current patterns
          </p>
        </div>
      </div>

      {/* Projection Controls */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">Projection Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
              Projection Horizon
            </label>
            <div className="flex gap-2">
              {[5, 10, 20, 30].map((years) => (
                <button
                  key={years}
                  onClick={() => setProjectionYears(years)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    projectionYears === years
                      ? 'bg-(--color-accent) text-(--color-primary-dark)'
                      : 'bg-(--color-surface-elevated) text-(--color-text-secondary) hover:text-(--color-text)'
                  )}
                >
                  {years} Years
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={runProjection}
              className="btn-primary flex items-center gap-2 w-full md:w-auto"
            >
              <TrendingUp className="w-4 h-4" />
              Run Projection
            </button>
          </div>
        </div>

        {/* Current State Info */}
        <div className="mt-6 p-4 rounded-lg bg-(--color-primary-dark) grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-(--color-text-muted)">Current NAV</p>
            <p className="font-semibold text-(--color-text) mono">{formatNaira(store.nav)}</p>
          </div>
          <div>
            <p className="text-xs text-(--color-text-muted)">Unit Price</p>
            <p className="font-semibold text-(--color-accent) mono">₦{store.unitPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-(--color-text-muted)">Money Market Rate</p>
            <p className="font-semibold text-(--color-text)">{formatPercentage(store.moneyMarketRate)}/yr</p>
          </div>
          <div>
            <p className="text-xs text-(--color-text-muted)">Active Members</p>
            <p className="font-semibold text-(--color-text)">{store.members.filter(m => m.isActive).length}</p>
          </div>
        </div>
      </div>

      {/* Projection Results */}
      {showProjection && projectionData.length > 0 && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-5 border-(--color-accent)/30 glow-accent">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-(--color-accent)" />
                </div>
                <p className="text-sm text-(--color-text-secondary)">Projected NAV</p>
              </div>
              <p className="text-2xl font-bold text-(--color-accent) mono">
                {formatNaira(finalResult.nav)}
              </p>
              <p className="text-xs text-(--color-text-muted) mt-1">
                After {projectionYears} years
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-(--color-gold)" />
                </div>
                <p className="text-sm text-(--color-text-secondary)">Total Contributions</p>
              </div>
              <p className="text-2xl font-bold text-(--color-text) mono">
                {formatNaira(finalResult.totalContributions)}
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-(--color-success)/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-(--color-success)" />
                </div>
                <p className="text-sm text-(--color-text-secondary)">Projected Gain</p>
              </div>
              <p className="text-2xl font-bold text-(--color-success) mono">
                {formatNaira(finalResult.nav - finalResult.totalContributions)}
              </p>
              <p className="text-xs text-(--color-text-muted) mt-1">
                {((finalResult.nav - finalResult.totalContributions) / finalResult.totalContributions * 100).toFixed(1)}% ROI
              </p>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-(--color-info)" />
                </div>
                <p className="text-sm text-(--color-text-secondary)">Unit Price</p>
              </div>
              <p className="text-2xl font-bold text-(--color-text) mono">
                ₦{finalResult.unitPrice.toFixed(2)}
              </p>
              <p className="text-xs text-(--color-success) mt-1">
                +{(((finalResult.unitPrice - store.initialUnitPrice) / store.initialUnitPrice) * 100).toFixed(1)}% growth
              </p>
            </div>
          </div>

          {/* NAV Growth Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-(--color-text) mb-4">NAV Growth Projection</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="projNavGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9A5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00D9A5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="projContribGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#234567" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: '#234567' }}
                    tickLine={{ stroke: '#234567' }}
                    tickFormatter={(value) => `Year ${value}`}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: '#234567' }}
                    tickLine={{ stroke: '#234567' }}
                    tickFormatter={(value) => `₦${(value / 1_000_000_000).toFixed(1)}B`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F2942',
                      border: '1px solid #234567',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                    }}
                    formatter={(value: number, name: string) => [
                      formatNaira(value),
                      name === 'nav' ? 'Net Asset Value' : 'Total Contributions',
                    ]}
                    labelFormatter={(value) => `Year ${value}`}
                  />
                  <Legend
                    formatter={(value) =>
                      value === 'nav' ? 'Net Asset Value' : 'Total Contributions'
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="nav"
                    stroke="#00D9A5"
                    strokeWidth={2}
                    fill="url(#projNavGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="totalContributions"
                    stroke="#F5A623"
                    strokeWidth={2}
                    fill="url(#projContribGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Unit Price Growth */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-(--color-text) mb-4">Unit Price Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#234567" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: '#234567' }}
                    tickLine={{ stroke: '#234567' }}
                    tickFormatter={(value) => `Year ${value}`}
                  />
                  <YAxis
                    tick={{ fill: '#94A3B8', fontSize: 12 }}
                    axisLine={{ stroke: '#234567' }}
                    tickLine={{ stroke: '#234567' }}
                    tickFormatter={(value) => `₦${value.toLocaleString()}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F2942',
                      border: '1px solid #234567',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                    }}
                    formatter={(value: number) => [`₦${value.toFixed(2)}`, 'Unit Price']}
                    labelFormatter={(value) => `Year ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="unitPrice"
                    stroke="#00D9A5"
                    strokeWidth={3}
                    dot={{ fill: '#00D9A5', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, stroke: '#00D9A5', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Milestones */}
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-(--color-border)">
              <h3 className="text-lg font-semibold text-(--color-text)">Yearly Milestones</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Year</th>
                    <th className="text-right">NAV</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-right">Money Market</th>
                    <th className="text-right">Land Value</th>
                    <th className="text-right">Total Contributed</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData
                    .filter((_, i) => i % 4 === 0 || i === projectionData.length - 1)
                    .map((result) => (
                      <tr key={result.month}>
                        <td className="font-medium">Year {result.year}</td>
                        <td className="text-right mono text-(--color-accent)">{formatNaira(result.nav)}</td>
                        <td className="text-right mono">₦{result.unitPrice.toFixed(2)}</td>
                        <td className="text-right mono">{formatNaira(result.moneyMarketValue)}</td>
                        <td className="text-right mono">{formatNaira(result.landValue)}</td>
                        <td className="text-right mono">{formatNaira(result.totalContributions)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!showProjection && (
        <div className="card p-12 text-center">
          <TrendingUp className="w-16 h-16 text-(--color-text-muted) mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-(--color-text) mb-2">
            Ready to Project?
          </h3>
          <p className="text-(--color-text-secondary) max-w-md mx-auto mb-6">
            Select a projection horizon and run the simulation to see how your fund could grow over time based on current contribution patterns and investment returns.
          </p>
          <button onClick={runProjection} className="btn-primary">
            Run {projectionYears}-Year Projection
          </button>
        </div>
      )}
    </div>
  );
}

