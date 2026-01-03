'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Member } from '@/lib/types';
import { MemberBalance } from '@/lib/types';
import { formatNaira } from '@/lib/calculations';

interface OwnershipChartProps {
  members: Member[];
  balances: MemberBalance[];
}

const COLORS = [
  '#00D9A5',
  '#F5A623',
  '#3B82F6',
  '#EC4899',
  '#8B5CF6',
  '#10B981',
  '#EF4444',
  '#06B6D4',
  '#F97316',
  '#84CC16',
];

export function OwnershipChart({ members, balances }: OwnershipChartProps) {
  const data = useMemo(() => {
    return balances
      .filter((b) => b.totalUnits > 0)
      .map((balance) => {
        const member = members.find((m) => m.id === balance.memberId);
        return {
          name: member?.name || 'Unknown',
          value: balance.ownershipPercentage * 100,
          units: balance.totalUnits,
          currentValue: balance.currentValue,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [balances, members]);

  if (data.length === 0) {
    return (
      <div className="card p-4 sm:p-6 h-64 sm:h-80 flex items-center justify-center">
        <p className="text-(--color-text-muted) text-sm sm:text-base">No ownership data yet.</p>
      </div>
    );
  }

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-(--color-text) mb-4">Ordinary Shares Distribution</h3>
      <div className="h-56 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name?.split(' ')[0]} ${value.toFixed(1)}%`}
              labelLine={{ stroke: '#64748B', strokeWidth: 1 }}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F2942',
                border: '1px solid #234567',
                borderRadius: '8px',
                color: '#F8FAFC',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string, props: { payload?: { currentValue: number; units: number } }) => [
                <span key="value">
                  {value.toFixed(2)}% ({formatNaira(props?.payload?.currentValue ?? 0)})
                </span>,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Mobile Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:hidden">
        {data.slice(0, 6).map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full flex-shrink-0" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-(--color-text-secondary) truncate">
              {entry.name?.split(' ')[0]} ({entry.value.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
