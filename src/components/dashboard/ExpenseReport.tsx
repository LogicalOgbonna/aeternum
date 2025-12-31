'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { FundState, ExpenseCategory } from '@/lib/types';
import { formatNaira, getExpensesByCategory, getTotalExpenses, getMonthlyExpenseTotal, getYearlyExpenseTotal, getOneOffExpenseTotal } from '@/lib/calculations';
import { expenseCategoryLabels, expenseCategoryColors } from '@/lib/personas';
import { Receipt, Calendar, CalendarDays, CalendarClock } from 'lucide-react';

interface ExpenseReportProps {
  state: FundState;
}

const COLORS = Object.values(expenseCategoryColors);

export function ExpenseReport({ state }: ExpenseReportProps) {
  const totalExpenses = getTotalExpenses(state);
  const monthlyExpenseTotal = getMonthlyExpenseTotal(state);
  const yearlyExpenseTotal = getYearlyExpenseTotal(state);
  const oneOffExpenseTotal = getOneOffExpenseTotal(state);
  const expensesByCategory = getExpensesByCategory(state);

  const data = useMemo(() => {
    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: expenseCategoryLabels[category as ExpenseCategory] || category,
      value: amount,
      category: category as ExpenseCategory,
    })).sort((a, b) => b.value - a.value);
  }, [expensesByCategory]);

  if (totalExpenses === 0) {
    return (
      <div className="card p-6 h-80 flex flex-col items-center justify-center">
        <Receipt className="w-12 h-12 text-(--color-text-muted) mb-3" />
        <p className="text-(--color-text-secondary) font-medium">No Expenses Yet</p>
        <p className="text-sm text-(--color-text-muted) text-center mt-1">
          Expenses will appear here as the simulation progresses
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-(--color-text) mb-4">Expense Summary</h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-(--color-text-muted)" />
            <p className="text-xs text-(--color-text-muted)">Monthly</p>
          </div>
          <p className="text-sm font-bold mono text-(--color-error)">{formatNaira(monthlyExpenseTotal)}</p>
        </div>
        <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
          <div className="flex items-center gap-1 mb-1">
            <CalendarDays className="w-3 h-3 text-(--color-text-muted)" />
            <p className="text-xs text-(--color-text-muted)">Yearly</p>
          </div>
          <p className="text-sm font-bold mono text-(--color-warning)">{formatNaira(yearlyExpenseTotal)}</p>
        </div>
        <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
          <div className="flex items-center gap-1 mb-1">
            <CalendarClock className="w-3 h-3 text-(--color-text-muted)" />
            <p className="text-xs text-(--color-text-muted)">One-Off</p>
          </div>
          <p className="text-sm font-bold mono text-(--color-info)">{formatNaira(oneOffExpenseTotal)}</p>
        </div>
      </div>
      
      <div className="p-3 rounded-lg bg-(--color-surface-elevated) mb-4">
        <p className="text-xs text-(--color-text-muted)">Total Paid (All Time)</p>
        <p className="text-lg font-bold mono text-(--color-text)">{formatNaira(totalExpenses)}</p>
      </div>

      {/* Pie Chart */}
      <div className="h-48">
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
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={expenseCategoryColors[entry.category] || COLORS[index % COLORS.length]}
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
              formatter={(value: number) => [formatNaira(value), 'Amount']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-4">
        {data.map((entry, index) => (
          <div key={entry.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: expenseCategoryColors[entry.category] }}
              />
              <span className="text-sm text-(--color-text-secondary)">{entry.name}</span>
            </div>
            <span className="text-sm font-medium mono text-(--color-text)">
              {formatNaira(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

