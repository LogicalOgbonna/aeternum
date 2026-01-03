'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthSnapshot } from '@/lib/types';
import { formatNaira, getMonthName } from '@/lib/calculations';

interface NAVChartProps {
  snapshots: MonthSnapshot[];
  startDate: Date;
}

export function NAVChart({ snapshots, startDate }: NAVChartProps) {
  const data = useMemo(() => {
    return snapshots.map((snapshot) => ({
      month: getMonthName(snapshot.month, startDate),
      nav: snapshot.nav,
      moneyMarket: snapshot.moneyMarketValue,
      land: snapshot.landValue,
    }));
  }, [snapshots, startDate]);

  if (data.length === 0) {
    return (
      <div className="card p-4 sm:p-6 h-64 sm:h-80 flex items-center justify-center">
        <p className="text-(--color-text-muted) text-sm sm:text-base text-center px-4">No data yet. Advance the simulation to see NAV growth.</p>
      </div>
    );
  }

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-(--color-text) mb-4">NAV Over Time</h3>
      <div className="h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D9A5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00D9A5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="landGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F5A623" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F5A623" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#234567" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              axisLine={{ stroke: '#234567' }}
              tickLine={{ stroke: '#234567' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: '#94A3B8', fontSize: 10 }}
              axisLine={{ stroke: '#234567' }}
              tickLine={{ stroke: '#234567' }}
              tickFormatter={(value) => `₦${(value / 1_000_000).toFixed(0)}M`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F2942',
                border: '1px solid #234567',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => [
                formatNaira(value),
                name === 'nav' ? 'Total NAV' : name === 'moneyMarket' ? 'Money Market' : 'Land Assets',
              ]}
              labelStyle={{ color: '#94A3B8' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              formatter={(value) =>
                value === 'nav' ? 'NAV' : value === 'moneyMarket' ? 'Cash' : 'Land'
              }
            />
            <Area
              type="monotone"
              dataKey="nav"
              stroke="#00D9A5"
              strokeWidth={2}
              fill="url(#navGradient)"
            />
            <Area
              type="monotone"
              dataKey="moneyMarket"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#mmGradient)"
            />
            <Area
              type="monotone"
              dataKey="land"
              stroke="#F5A623"
              strokeWidth={2}
              fill="url(#landGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
