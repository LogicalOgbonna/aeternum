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
      <div className="card p-6 h-80 flex items-center justify-center">
        <p className="text-(--color-text-muted)">No ownership data yet.</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-(--color-text) mb-4">Ordinary Shares Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
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
    </div>
  );
}


