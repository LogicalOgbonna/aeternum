'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
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
      <div className="card p-4 sm:p-6 h-64 sm:h-80 flex flex-col items-center justify-center">
        <Receipt className="w-10 h-10 sm:w-12 sm:h-12 text-(--color-text-muted) mb-3" />
        <p className="text-(--color-text-secondary) font-medium text-sm sm:text-base">No Expenses Yet</p>
        <p className="text-xs sm:text-sm text-(--color-text-muted) text-center mt-1 px-4">
          Expenses will appear here as the simulation progresses
        </p>
      </div>
    );
  }

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-(--color-text) mb-4">Expense Summary</h3>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-(--color-text-muted)" />
            <p className="text-xs text-(--color-text-muted)">Monthly</p>
          </div>
          <p className="text-xs sm:text-sm font-bold mono text-(--color-error) truncate">{formatNaira(monthlyExpenseTotal)}</p>
        </div>
        <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
          <div className="flex items-center gap-1 mb-1">
            <CalendarDays className="w-3 h-3 text-(--color-text-muted)" />
            <p className="text-xs text-(--color-text-muted)">Yearly</p>
          </div>
          <p className="text-xs sm:text-sm font-bold mono text-(--color-warning) truncate">{formatNaira(yearlyExpenseTotal)}</p>
        </div>
        <div className="p-2 rounded-lg bg-(--color-surface-elevated)">
          <div className="flex items-center gap-1 mb-1">
            <CalendarClock className="w-3 h-3 text-(--color-text-muted)" />
            <p className="text-xs text-(--color-text-muted)">One-Off</p>
          </div>
          <p className="text-xs sm:text-sm font-bold mono text-(--color-info) truncate">{formatNaira(oneOffExpenseTotal)}</p>
        </div>
      </div>
      
      <div className="p-3 rounded-lg bg-(--color-surface-elevated) mb-4">
        <p className="text-xs text-(--color-text-muted)">Total Paid (All Time)</p>
        <p className="text-base sm:text-lg font-bold mono text-(--color-text)">{formatNaira(totalExpenses)}</p>
      </div>

      {/* Pie Chart */}
      <div className="h-40 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={55}
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
                fontSize: '12px',
              }}
              formatter={(value: number) => [formatNaira(value), 'Amount']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="space-y-2 mt-4">
        {data.map((entry) => (
          <div key={entry.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div 
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: expenseCategoryColors[entry.category] }}
              />
              <span className="text-xs sm:text-sm text-(--color-text-secondary) truncate">{entry.name}</span>
            </div>
            <span className="text-xs sm:text-sm font-medium mono text-(--color-text) flex-shrink-0 ml-2">
              {formatNaira(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
