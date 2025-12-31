'use client';

import { useEffect, useState } from 'react';
import { useFundStore } from '@/lib/store';
import { formatNaira, getTotalExpenses, getMonthlyExpenseTotal, getYearlyExpenseTotal, getOneOffExpenseTotal, getExpensesByCategory } from '@/lib/calculations';
import { expenseCategoryLabels, expenseCategoryColors, expenseOccurrenceLabels } from '@/lib/personas';
import { ExpenseCategory, ExpenseOccurrence } from '@/lib/types';
import { 
  Receipt,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Calendar,
  CalendarDays,
  CalendarClock,
  History,
  TrendingDown,
  Pencil,
  Check,
  X
} from 'lucide-react';

export default function ExpensesPage() {
  const store = useFundStore();
  const [mounted, setMounted] = useState(false);
  
  // New expense form state
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseCategory>('other');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseOccurrence, setNewExpenseOccurrence] = useState<ExpenseOccurrence>('monthly');

  // Edit expense state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('other');
  const [editAmount, setEditAmount] = useState('');
  const [editOccurrence, setEditOccurrence] = useState<ExpenseOccurrence>('monthly');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>;
  }

  // Expenses
  const totalExpenses = getTotalExpenses(store);
  const monthlyExpenseTotal = getMonthlyExpenseTotal(store);
  const yearlyExpenseTotal = getYearlyExpenseTotal(store);
  const oneOffExpenseTotal = getOneOffExpenseTotal(store);
  const expensesByCategory = getExpensesByCategory(store);

  const handleAddExpense = () => {
    if (!newExpenseName || !newExpenseAmount) return;
    const amount = parseFloat(newExpenseAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    store.addExpense(newExpenseCategory, newExpenseName, amount, newExpenseOccurrence);
    setNewExpenseName('');
    setNewExpenseAmount('');
    setNewExpenseCategory('other');
    setNewExpenseOccurrence('monthly');
  };

  const handleStartEdit = (expense: typeof store.expenseSettings[0]) => {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditCategory(expense.category);
    setEditAmount(expense.amount.toString());
    setEditOccurrence(expense.occurrence);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditCategory('other');
    setEditAmount('');
    setEditOccurrence('monthly');
  };

  const handleSaveEdit = () => {
    if (!editingId || !editName || !editAmount) return;
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) return;

    store.updateExpense(editingId, {
      name: editName,
      category: editCategory,
      amount: amount,
      occurrence: editOccurrence,
    });
    handleCancelEdit();
  };

  // Get recent expense records
  const recentExpenseRecords = [...(store.expenseRecords || [])]
    .sort((a, b) => b.month - a.month)
    .slice(0, 20);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text)">Expenses</h1>
          <p className="text-(--color-text-secondary) mt-1">
            Manage recurring fund expenses and view expense history
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-error)/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-(--color-error)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-muted)">Monthly</p>
              <p className="text-xl font-bold mono text-(--color-error)">
                {formatNaira(monthlyExpenseTotal)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-warning)/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-(--color-warning)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-muted)">Yearly</p>
              <p className="text-xl font-bold mono text-(--color-warning)">
                {formatNaira(yearlyExpenseTotal)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center">
              <CalendarClock className="w-5 h-5 text-(--color-info)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-muted)">Pending One-Off</p>
              <p className="text-xl font-bold mono text-(--color-info)">
                {formatNaira(oneOffExpenseTotal)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-text-muted)/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-(--color-text-muted)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-muted)">Total Paid</p>
              <p className="text-xl font-bold mono text-(--color-text)">
                {formatNaira(totalExpenses)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-(--color-accent)" />
            </div>
            <div>
              <p className="text-sm text-(--color-text-muted)">Active</p>
              <p className="text-xl font-bold text-(--color-text)">
                {(store.expenseSettings || []).filter(e => e.isActive).length} items
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Expense */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-(--color-accent)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-(--color-text)">Add New Expense</h2>
            <p className="text-sm text-(--color-text-muted)">
              Create a new expense (monthly, yearly, or one-off)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Expense name"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            className="px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none"
          />
          <select
            value={newExpenseCategory}
            onChange={(e) => setNewExpenseCategory(e.target.value as ExpenseCategory)}
            className="px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none"
          >
            {Object.entries(expenseCategoryLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <select
            value={newExpenseOccurrence}
            onChange={(e) => setNewExpenseOccurrence(e.target.value as ExpenseOccurrence)}
            className="px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none"
          >
            {Object.entries(expenseOccurrenceLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-muted)">₦</span>
            <input
              type="number"
              placeholder="Amount"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none mono"
            />
          </div>
          <button
            onClick={handleAddExpense}
            disabled={!newExpenseName || !newExpenseAmount}
            className="px-6 py-3 rounded-xl bg-(--color-accent) text-(--color-primary-dark) font-medium hover:bg-(--color-accent)/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Expense Settings */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-(--color-border) flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-(--color-text-secondary)" />
            <h3 className="text-lg font-semibold text-(--color-text)">Recurring Expenses</h3>
          </div>
          <p className="text-sm text-(--color-text-muted)">
            Monthly/One-Off: deducted after contributions • Yearly: before dividends
          </p>
        </div>

        {(store.expenseSettings || []).length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-(--color-text-muted) mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">No expenses configured</p>
            <p className="text-sm text-(--color-text-muted) mt-1">
              Add recurring expenses to track fund operating costs
            </p>
          </div>
        ) : (
          <div className="divide-y divide-(--color-border)">
            {(store.expenseSettings || []).map((expense) => (
              <div 
                key={expense.id}
                className={`p-4 transition-colors ${
                  expense.isActive 
                    ? 'hover:bg-(--color-primary-dark)/30' 
                    : 'bg-(--color-primary-dark)/20 opacity-60'
                }`}
              >
                {editingId === expense.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Expense name"
                        className="px-3 py-2 rounded-lg bg-(--color-primary-dark) border border-(--color-accent) text-(--color-text) focus:outline-none"
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as ExpenseCategory)}
                        className="px-3 py-2 rounded-lg bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none"
                      >
                        {Object.entries(expenseCategoryLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <select
                        value={editOccurrence}
                        onChange={(e) => setEditOccurrence(e.target.value as ExpenseOccurrence)}
                        className="px-3 py-2 rounded-lg bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none"
                      >
                        {Object.entries(expenseOccurrenceLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-text-muted)">₦</span>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          placeholder="Amount"
                          className="w-full pl-8 pr-3 py-2 rounded-lg bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none mono"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveEdit}
                        disabled={!editName || !editAmount}
                        className="px-4 py-2 rounded-lg bg-(--color-success) text-white font-medium hover:bg-(--color-success)/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 rounded-lg border border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-surface-elevated) transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: expenseCategoryColors[expense.category] }}
                      />
                      <div>
                        <p className={`font-medium ${expense.isActive ? 'text-(--color-text)' : 'text-(--color-text-muted)'}`}>
                          {expense.name}
                        </p>
                        <p className="text-sm text-(--color-text-muted)">
                          {expenseCategoryLabels[expense.category]} • {expenseOccurrenceLabels[expense.occurrence]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`text-lg font-semibold mono ${expense.isActive ? (expense.occurrence === 'yearly' ? 'text-(--color-warning)' : expense.occurrence === 'one_off' ? 'text-(--color-info)' : 'text-(--color-error)') : 'text-(--color-text-muted)'}`}>
                        {formatNaira(expense.amount)}{expense.occurrence === 'monthly' ? '/mo' : expense.occurrence === 'yearly' ? '/yr' : ''}
                      </p>
                      <button
                        onClick={() => handleStartEdit(expense)}
                        className="p-2 rounded-lg hover:bg-(--color-accent)/10 text-(--color-text-muted) hover:text-(--color-accent) transition-colors"
                        title="Edit expense"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => store.toggleExpense(expense.id)}
                        className="p-2 rounded-lg hover:bg-(--color-surface-elevated) transition-colors"
                        title={expense.isActive ? 'Disable expense' : 'Enable expense'}
                      >
                        {expense.isActive ? (
                          <ToggleRight className="w-6 h-6 text-(--color-success)" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-(--color-text-muted)" />
                        )}
                      </button>
                      <button
                        onClick={() => store.removeExpense(expense.id)}
                        className="p-2 rounded-lg hover:bg-(--color-error)/10 text-(--color-text-muted) hover:text-(--color-error) transition-colors"
                        title="Remove expense"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expense by Category */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-(--color-info)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-(--color-text)">Expenses by Category</h2>
              <p className="text-sm text-(--color-text-muted)">
                Total expenses paid, grouped by category
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(expensesByCategory).map(([category, amount]) => (
              <div 
                key={category}
                className="p-4 rounded-xl bg-(--color-surface-elevated) border-l-4"
                style={{ borderLeftColor: expenseCategoryColors[category as ExpenseCategory] }}
              >
                <p className="text-sm text-(--color-text-muted)">
                  {expenseCategoryLabels[category as ExpenseCategory]}
                </p>
                <p className="text-lg font-bold mono text-(--color-text)">
                  {formatNaira(amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expense History */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-(--color-border) flex items-center gap-3">
          <History className="w-5 h-5 text-(--color-text-secondary)" />
          <h3 className="text-lg font-semibold text-(--color-text)">Recent Expense Records</h3>
        </div>

        {recentExpenseRecords.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-(--color-text-muted) mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">No expense records yet</p>
            <p className="text-sm text-(--color-text-muted) mt-1">
              Expenses will be recorded as the simulation progresses
            </p>
          </div>
        ) : (
          <div className="divide-y divide-(--color-border) max-h-96 overflow-y-auto">
            {recentExpenseRecords.map((record) => (
              <div 
                key={record.id}
                className="flex items-center justify-between p-4 hover:bg-(--color-primary-dark)/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: expenseCategoryColors[record.category] }}
                  />
                  <div>
                    <p className="font-medium text-(--color-text)">{record.name}</p>
                    <p className="text-sm text-(--color-text-muted)">
                      Month {record.month} • {expenseCategoryLabels[record.category]} • {expenseOccurrenceLabels[record.occurrence]}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold mono ${record.occurrence === 'yearly' ? 'text-(--color-warning)' : record.occurrence === 'one_off' ? 'text-(--color-info)' : 'text-(--color-error)'}`}>
                  -{formatNaira(record.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

