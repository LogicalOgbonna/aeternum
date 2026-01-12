'use client';

import { useState, useSyncExternalStore, useCallback, useMemo } from 'react';
import { useGateValue } from '@statsig/react-bindings';
import { notFound } from 'next/navigation';
import { useLendingStore } from '@/lib/lending-store';
import { useFundStore } from '@/lib/store';
import { formatNaira, getMemberBalances } from '@/lib/calculations';
import { Loan, LoanStatus, Collateral } from '@/lib/types';
import {
  Banknote,
  Clock,
  Users,
  Check,
  X,
  Plus,
  CheckCircle,
  XCircle,
  Settings,
  History,
  ChevronDown,
  ChevronUp,
  Shield,
  ShieldOff,
  AlertTriangle,
  MapPin,
  BarChart3,
  Coins,
  FileText,
  Wallet,
} from 'lucide-react';

// Client-only hook for hydration check
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function LendingPage() {
  const showLendingFeature = useGateValue('lending_feature_');
  const lendingStore = useLendingStore();
  const fundStore = useFundStore();
  const isHydrated = useHydrated();
  
  const [showNewLoanModal, setShowNewLoanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [expandedLoans, setExpandedLoans] = useState<Set<string>>(new Set());
  
  // Settings form state - initialize from store values
  const defaultUnsecuredRate = lendingStore._hasHydrated 
    ? lendingStore.settings.unsecuredInterestRate * 100 
    : 10;
  const defaultSecuredRate = lendingStore._hasHydrated 
    ? lendingStore.settings.securedInterestRate * 100 
    : 18;
  const defaultLoanTerm = lendingStore._hasHydrated 
    ? lendingStore.settings.defaultLoanTermMonths 
    : 12;
  const defaultCollateralThreshold = lendingStore._hasHydrated 
    ? lendingStore.settings.collateralThreshold * 100 
    : 50;
    
  const [unsecuredInterestRate, setUnsecuredInterestRate] = useState(defaultUnsecuredRate);
  const [securedInterestRate, setSecuredInterestRate] = useState(defaultSecuredRate);
  const [defaultTermMonths, setDefaultTermMonths] = useState(defaultLoanTerm);
  const [collateralThreshold, setCollateralThreshold] = useState(defaultCollateralThreshold);
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);
  
  // New loan form state
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTermMonths, setLoanTermMonths] = useState(defaultLoanTerm);
  const [loanNotes, setLoanNotes] = useState('');
  
  // Collateral form state
  const [collateralType, setCollateralType] = useState<Collateral['type']>('land');
  const [collateralDescription, setCollateralDescription] = useState('');
  const [collateralValue, setCollateralValue] = useState('');
  
  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const activeMembers = fundStore.members.filter((m) => m.isActive);
  const memberBalances = getMemberBalances(fundStore);

  // Get selected member's balance
  const selectedMemberBalance = useMemo(() => {
    if (!selectedMemberId) return 0;
    const balance = memberBalances.find((b) => b.memberId === selectedMemberId);
    return balance?.currentValue || 0;
  }, [selectedMemberId, memberBalances]);

  // Determine if loan requires collateral
  const requiresCollateral = useMemo(() => {
    if (!loanAmount || !selectedMemberBalance) return false;
    const ratio = Number(loanAmount) / selectedMemberBalance;
    const threshold = lendingStore._hasHydrated 
      ? lendingStore.settings.collateralThreshold 
      : 0.5;
    return ratio > threshold;
  }, [loanAmount, selectedMemberBalance, lendingStore._hasHydrated, lendingStore.settings.collateralThreshold]);

  // Get appropriate interest rate based on loan type
  const currentInterestRate = useMemo(() => {
    if (!lendingStore._hasHydrated) return requiresCollateral ? 18 : 10;
    return requiresCollateral 
      ? lendingStore.settings.securedInterestRate * 100 
      : lendingStore.settings.unsecuredInterestRate * 100;
  }, [requiresCollateral, lendingStore._hasHydrated, lendingStore.settings]);

  // Loan to balance ratio
  const loanToBalanceRatio = useMemo(() => {
    if (!loanAmount || !selectedMemberBalance) return 0;
    return (Number(loanAmount) / selectedMemberBalance) * 100;
  }, [loanAmount, selectedMemberBalance]);

  // Calculate available cash for lending (free cash not tied to investments/land)
  // Available = Money Market Balance - Outstanding Loans (principal already lent out)
  const totalOutstandingPrincipal = useMemo(() => {
    return lendingStore.loans
      .filter((loan) => loan.status === 'active')
      .reduce((sum, loan) => sum + loan.principal, 0);
  }, [lendingStore.loans]);

  const availableCashForLending = useMemo(() => {
    const moneyMarketBalance = fundStore.moneyMarketBalance || 0;
    return Math.max(0, moneyMarketBalance - totalOutstandingPrincipal);
  }, [fundStore.moneyMarketBalance, totalOutstandingPrincipal]);

  // Check if loan amount exceeds available cash
  const exceedsAvailableCash = useMemo(() => {
    if (!loanAmount) return false;
    return Number(loanAmount) > availableCashForLending;
  }, [loanAmount, availableCashForLending]);

  // Sync settings when store hydrates
  const syncSettings = useCallback(() => {
    if (lendingStore._hasHydrated) {
      setUnsecuredInterestRate(lendingStore.settings.unsecuredInterestRate * 100);
      setSecuredInterestRate(lendingStore.settings.securedInterestRate * 100);
      setDefaultTermMonths(lendingStore.settings.defaultLoanTermMonths);
      setCollateralThreshold(lendingStore.settings.collateralThreshold * 100);
      setLoanTermMonths(lendingStore.settings.defaultLoanTermMonths);
    }
  }, [lendingStore._hasHydrated, lendingStore.settings]);

  // Call sync on first hydration
  if (lendingStore._hasHydrated && unsecuredInterestRate === 10 && lendingStore.settings.unsecuredInterestRate !== 0.10) {
    syncSettings();
  }

  // In development, allow access even if feature flag is off for testing
  const isDev = process.env.NODE_ENV === 'development';
  if (!showLendingFeature && !isDev) {
    notFound();
  }

  if (!isHydrated || !lendingStore._hasHydrated) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-48 bg-(--color-surface) rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  
  const totalOutstanding = lendingStore.getTotalOutstanding();
  const totalLent = lendingStore.getTotalLent();
  const totalRepaid = lendingStore.getTotalRepaid();
  const activeLoans = lendingStore.loans.filter((l) => l.status === 'active');
  const paidLoans = lendingStore.loans.filter((l) => l.status === 'paid');

  const handleSaveSettings = () => {
    lendingStore.updateSettings({
      unsecuredInterestRate: unsecuredInterestRate / 100,
      securedInterestRate: securedInterestRate / 100,
      defaultLoanTermMonths: defaultTermMonths,
      collateralThreshold: collateralThreshold / 100,
    });
    setShowSettingsSuccess(true);
    setTimeout(() => setShowSettingsSuccess(false), 3000);
  };

  const handleCreateLoan = () => {
    const member = activeMembers.find((m) => m.id === selectedMemberId);
    if (!member || !loanAmount) return;

    // Validate loan doesn't exceed available cash
    if (Number(loanAmount) > availableCashForLending) {
      alert(`Loan amount exceeds available cash (${formatNaira(availableCashForLending)}). Loans can only be made from free cash not tied to investments or land.`);
      return;
    }

    // Validate collateral if required
    if (requiresCollateral && (!collateralDescription || !collateralValue)) {
      alert('Collateral details are required for loans above 50% of member balance');
      return;
    }

    const collateral: Collateral | undefined = requiresCollateral 
      ? {
          type: collateralType,
          description: collateralDescription,
          estimatedValue: Number(collateralValue),
        }
      : undefined;

    lendingStore.createLoan({
      borrowerMemberId: selectedMemberId,
      borrowerName: member.name,
      principal: Number(loanAmount),
      borrowerBalance: selectedMemberBalance,
      termMonths: loanTermMonths,
      collateral,
      notes: loanNotes || undefined,
    });

    // Reset form
    setSelectedMemberId('');
    setLoanAmount('');
    setLoanNotes('');
    setCollateralType('land');
    setCollateralDescription('');
    setCollateralValue('');
    setShowNewLoanModal(false);
  };

  const handleRecordPayment = () => {
    if (!selectedLoan || !paymentAmount) return;

    lendingStore.recordPayment(
      selectedLoan.id,
      Number(paymentAmount),
      'Admin',
      paymentNotes || undefined
    );

    // Reset form
    setPaymentAmount('');
    setPaymentNotes('');
    setSelectedLoan(null);
    setShowPaymentModal(false);
  };

  const handleMarkDefaulted = (loanId: string) => {
    if (confirm('Are you sure you want to mark this loan as defaulted?')) {
      lendingStore.updateLoanStatus(loanId, 'defaulted');
    }
  };

  const handleCancelLoan = (loanId: string) => {
    if (confirm('Are you sure you want to cancel this loan?')) {
      lendingStore.cancelLoan(loanId);
    }
  };

  const toggleLoanExpanded = (loanId: string) => {
    const newExpanded = new Set(expandedLoans);
    if (newExpanded.has(loanId)) {
      newExpanded.delete(loanId);
    } else {
      newExpanded.add(loanId);
    }
    setExpandedLoans(newExpanded);
  };

  const getStatusBadge = (status: LoanStatus) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-warning">Active</span>;
      case 'paid':
        return <span className="badge badge-success">Paid</span>;
      case 'defaulted':
        return <span className="badge badge-error">Defaulted</span>;
      case 'cancelled':
        return <span className="badge badge-neutral">Cancelled</span>;
    }
  };

  const getLoanTypeBadge = (loan: Loan) => {
    if (loan.loanType === 'secured') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-(--color-warning)/10 text-(--color-warning)">
          <Shield className="w-3 h-3" />
          Secured
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-(--color-success)/10 text-(--color-success)">
        <ShieldOff className="w-3 h-3" />
        Unsecured
      </span>
    );
  };

  const getCollateralIcon = (type: Collateral['type']) => {
    switch (type) {
      case 'land':
        return <MapPin className="w-4 h-4" />;
      case 'investment':
        return <BarChart3 className="w-4 h-4" />;
      case 'shares':
        return <Coins className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const calculateProgress = (loan: Loan) => {
    return Math.min(100, (loan.amountPaid / loan.totalDue) * 100);
  };

  const isOverdue = (loan: Loan) => {
    return loan.status === 'active' && new Date(loan.dueDate) < new Date();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-(--color-text)">Member Lending</h1>
          <p className="text-sm sm:text-base text-(--color-text-secondary) mt-1">
            Manage loans to syndicate members
          </p>
        </div>
        <button
          onClick={() => setShowNewLoanModal(true)}
          className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          New Loan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-(--color-gold)" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-(--color-text-muted)">Available Cash</p>
              <p className="text-lg sm:text-xl font-bold mono text-(--color-gold)">
                {formatNaira(availableCashForLending)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-accent)/10 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-(--color-accent)" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-(--color-text-muted)">Total Lent</p>
              <p className="text-lg sm:text-xl font-bold mono text-(--color-accent)">
                {formatNaira(totalLent)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-warning)/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-(--color-warning)" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-(--color-text-muted)">Outstanding</p>
              <p className="text-lg sm:text-xl font-bold mono text-(--color-warning)">
                {formatNaira(totalOutstanding)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-success)/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-(--color-success)" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-(--color-text-muted)">Total Repaid</p>
              <p className="text-lg sm:text-xl font-bold mono text-(--color-success)">
                {formatNaira(totalRepaid)}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-info)/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-(--color-info)" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-(--color-text-muted)">Active Loans</p>
              <p className="text-lg sm:text-xl font-bold text-(--color-text)">
                {activeLoans.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Card */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-(--color-gold)/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-(--color-gold)" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-(--color-text)">Lending Settings</h2>
            <p className="text-xs sm:text-sm text-(--color-text-muted)">
              Configure interest rates and collateral threshold
            </p>
          </div>
        </div>

        {/* Interest Rate Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-(--color-success)/5 border border-(--color-success)/20">
            <div className="flex items-center gap-2 mb-2">
              <ShieldOff className="w-4 h-4 text-(--color-success)" />
              <span className="text-sm font-medium text-(--color-success)">Unsecured Loans</span>
            </div>
            <p className="text-xs text-(--color-text-muted)">
              For loans ≤{collateralThreshold}% of member balance. No collateral required.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-(--color-warning)/5 border border-(--color-warning)/20">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-(--color-warning)" />
              <span className="text-sm font-medium text-(--color-warning)">Secured Loans</span>
            </div>
            <p className="text-xs text-(--color-text-muted)">
              For loans &gt;{collateralThreshold}% of member balance. Collateral required.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
              Unsecured Rate
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={unsecuredInterestRate}
                onChange={(e) => setUnsecuredInterestRate(Number(e.target.value))}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-(--color-primary-dark) border border-(--color-success)/30 text-(--color-text) focus:border-(--color-success) focus:outline-none focus:ring-1 focus:ring-(--color-success) mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-muted)">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
              Secured Rate
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={securedInterestRate}
                onChange={(e) => setSecuredInterestRate(Number(e.target.value))}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-(--color-primary-dark) border border-(--color-warning)/30 text-(--color-text) focus:border-(--color-warning) focus:outline-none focus:ring-1 focus:ring-(--color-warning) mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-muted)">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
              Collateral Threshold
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="5"
                value={collateralThreshold}
                onChange={(e) => setCollateralThreshold(Number(e.target.value))}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-gold) focus:outline-none focus:ring-1 focus:ring-(--color-gold) mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-muted)">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
              Default Term
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="60"
                value={defaultTermMonths}
                onChange={(e) => setDefaultTermMonths(Number(e.target.value))}
                className="w-full px-4 py-3 pr-16 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-gold) focus:outline-none focus:ring-1 focus:ring-(--color-gold) mono"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-muted) text-xs">months</span>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSaveSettings}
              className="w-full px-6 py-3 rounded-xl bg-(--color-gold) text-(--color-primary-dark) font-medium hover:bg-(--color-gold)/90 transition-colors flex items-center justify-center gap-2"
            >
              {showSettingsSuccess ? <Check className="w-5 h-5" /> : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Active Loans */}
      <div className="card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-(--color-border) flex items-center gap-3">
          <Clock className="w-5 h-5 text-(--color-warning)" />
          <h3 className="text-base sm:text-lg font-semibold text-(--color-text)">Active Loans</h3>
          <span className="badge badge-warning ml-2">{activeLoans.length}</span>
        </div>

        {activeLoans.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <Banknote className="w-12 h-12 text-(--color-text-muted) mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">No active loans</p>
            <p className="text-sm text-(--color-text-muted) mt-1">
              Create a new loan to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-(--color-border)">
            {activeLoans.map((loan) => (
              <div key={loan.id} className="p-4 hover:bg-(--color-primary-dark)/30 transition-colors">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleLoanExpanded(loan.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-(--color-accent)/10 flex items-center justify-center text-(--color-accent) font-semibold shrink-0">
                      {loan.borrowerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-(--color-text) truncate">{loan.borrowerName}</p>
                        {loan.loanType && getLoanTypeBadge(loan)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-(--color-text-muted)">
                        <span>{loan.interestRate * 100}% interest</span>
                        <span>•</span>
                        <span className={isOverdue(loan) ? 'text-(--color-error)' : ''}>
                          Due {new Date(loan.dueDate).toLocaleDateString()}
                        </span>
                        {isOverdue(loan) && (
                          <span className="badge badge-error text-xs">Overdue</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-bold mono text-(--color-text)">
                        {formatNaira(loan.totalDue - loan.amountPaid)}
                      </p>
                      <p className="text-xs text-(--color-text-muted)">remaining</p>
                    </div>
                    {expandedLoans.has(loan.id) ? (
                      <ChevronUp className="w-5 h-5 text-(--color-text-muted)" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-(--color-text-muted)" />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-(--color-text-muted) mb-1">
                    <span>{formatNaira(loan.amountPaid)} paid</span>
                    <span>{formatNaira(loan.totalDue)} total</span>
                  </div>
                  <div className="h-2 bg-(--color-surface-elevated) rounded-full overflow-hidden">
                    <div
                      className="h-full bg-(--color-success) transition-all duration-500"
                      style={{ width: `${calculateProgress(loan)}%` }}
                    />
                  </div>
                </div>

                {/* Expanded details */}
                {expandedLoans.has(loan.id) && (
                  <div className="mt-4 pt-4 border-t border-(--color-border) space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div className="p-3 rounded-lg bg-(--color-surface-elevated)">
                        <p className="text-(--color-text-muted) text-xs">Principal</p>
                        <p className="font-semibold mono text-(--color-text)">{formatNaira(loan.principal)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-(--color-surface-elevated)">
                        <p className="text-(--color-text-muted) text-xs">Interest</p>
                        <p className="font-semibold mono text-(--color-gold)">
                          {formatNaira(loan.totalDue - loan.principal)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-(--color-surface-elevated)">
                        <p className="text-(--color-text-muted) text-xs">Loan-to-Balance</p>
                        <p className="font-semibold text-(--color-text)">
                          {loan.loanToBalanceRatio ? `${(loan.loanToBalanceRatio * 100).toFixed(0)}%` : 'N/A'}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-(--color-surface-elevated)">
                        <p className="text-(--color-text-muted) text-xs">Payments</p>
                        <p className="font-semibold text-(--color-text)">{loan.payments.length}</p>
                      </div>
                    </div>

                    {/* Collateral info */}
                    {loan.collateral && (
                      <div className="p-4 rounded-lg bg-(--color-warning)/5 border border-(--color-warning)/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-(--color-warning)" />
                          <span className="text-sm font-medium text-(--color-warning)">Collateral</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-(--color-text-muted)">Type</p>
                            <div className="flex items-center gap-1 capitalize text-(--color-text)">
                              {getCollateralIcon(loan.collateral.type)}
                              {loan.collateral.type}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-(--color-text-muted)">Description</p>
                            <p className="text-(--color-text)">{loan.collateral.description}</p>
                          </div>
                          <div>
                            <p className="text-xs text-(--color-text-muted)">Est. Value</p>
                            <p className="font-semibold mono text-(--color-text)">
                              {formatNaira(loan.collateral.estimatedValue)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {loan.notes && (
                      <div className="p-3 rounded-lg bg-(--color-surface-elevated)">
                        <p className="text-xs text-(--color-text-muted) mb-1">Notes</p>
                        <p className="text-sm text-(--color-text-secondary)">{loan.notes}</p>
                      </div>
                    )}

                    {/* Payment history */}
                    {loan.payments.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-(--color-text-muted) mb-2">Payment History</p>
                        <div className="space-y-2">
                          {loan.payments.map((payment) => (
                            <div 
                              key={payment.id} 
                              className="flex items-center justify-between p-2 rounded-lg bg-(--color-primary-dark)"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-(--color-success)" />
                                <span className="text-sm text-(--color-text)">
                                  {new Date(payment.paymentDate).toLocaleDateString()}
                                </span>
                              </div>
                              <span className="font-medium mono text-(--color-success)">
                                {formatNaira(payment.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLoan(loan);
                          setPaymentAmount((loan.totalDue - loan.amountPaid).toString());
                          setShowPaymentModal(true);
                        }}
                        className="px-4 py-2 rounded-lg bg-(--color-success) text-(--color-primary-dark) text-sm font-medium hover:bg-(--color-success)/90 transition-colors flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Record Payment
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkDefaulted(loan.id);
                        }}
                        className="px-4 py-2 rounded-lg bg-(--color-error)/10 text-(--color-error) text-sm font-medium hover:bg-(--color-error)/20 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Mark Defaulted
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelLoan(loan.id);
                        }}
                        className="px-4 py-2 rounded-lg bg-(--color-surface-elevated) text-(--color-text-secondary) text-sm font-medium hover:bg-(--color-surface-elevated)/80 transition-colors"
                      >
                        Cancel Loan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loan History */}
      <div className="card overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-(--color-border) flex items-center gap-3">
          <History className="w-5 h-5 text-(--color-text-secondary)" />
          <h3 className="text-base sm:text-lg font-semibold text-(--color-text)">Loan History</h3>
        </div>

        {paidLoans.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <History className="w-12 h-12 text-(--color-text-muted) mx-auto mb-4" />
            <p className="text-(--color-text-secondary)">No completed loans yet</p>
          </div>
        ) : (
          <div className="divide-y divide-(--color-border)">
            {paidLoans.map((loan) => (
              <div key={loan.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-(--color-success)/10 flex items-center justify-center text-(--color-success) font-semibold">
                      {loan.borrowerName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-(--color-text)">{loan.borrowerName}</p>
                        {loan.loanType && getLoanTypeBadge(loan)}
                      </div>
                      <p className="text-xs text-(--color-text-muted)">
                        Completed {new Date(loan.payments[loan.payments.length - 1]?.paymentDate || loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(loan.status)}
                    <p className="text-sm font-bold mono text-(--color-success) mt-1">
                      {formatNaira(loan.totalDue)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Loan Modal */}
      {showNewLoanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-surface) rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-(--color-border)">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-(--color-text)">Create New Loan</h3>
                <button
                  onClick={() => setShowNewLoanModal(false)}
                  className="p-2 rounded-lg hover:bg-(--color-surface-elevated) text-(--color-text-muted)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                  Borrower
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value);
                    setLoanAmount(''); // Reset loan amount when member changes
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none"
                >
                  <option value="">Select a member</option>
                  {activeMembers.map((member) => {
                    const balance = memberBalances.find((b) => b.memberId === member.id);
                    return (
                      <option key={member.id} value={member.id}>
                        {member.name} ({formatNaira(balance?.currentValue || 0)} balance)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Available Cash Info */}
              <div className="p-3 rounded-lg bg-(--color-gold)/5 border border-(--color-gold)/20">
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-(--color-gold)" />
                  <p className="text-xs font-medium text-(--color-gold)">Available Cash for Lending</p>
                </div>
                <p className="font-bold mono text-(--color-gold)">{formatNaira(availableCashForLending)}</p>
                <p className="text-xs text-(--color-text-muted) mt-1">
                  From money market (not invested in land/assets)
                </p>
              </div>

              {selectedMemberId && (
                <div className="p-3 rounded-lg bg-(--color-surface-elevated)">
                  <p className="text-xs text-(--color-text-muted)">Member Balance</p>
                  <p className="font-bold mono text-(--color-accent)">{formatNaira(selectedMemberBalance)}</p>
                  <p className="text-xs text-(--color-text-muted) mt-1">
                    Collateral required for loans &gt;{lendingStore.settings.collateralThreshold * 100}% ({formatNaira(selectedMemberBalance * lendingStore.settings.collateralThreshold)})
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                  Loan Amount
                  <span className="text-xs font-normal text-(--color-text-muted) ml-2">
                    (Max: {formatNaira(Math.min(availableCashForLending, selectedMemberBalance * lendingStore.settings.maxLoanPercentage || availableCashForLending))})
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-muted)">₦</span>
                  <input
                    type="number"
                    min="0"
                    max={Math.min(availableCashForLending, selectedMemberBalance * lendingStore.settings.maxLoanPercentage || availableCashForLending)}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="0"
                    className={`w-full px-4 py-3 pl-8 rounded-xl bg-(--color-primary-dark) border text-(--color-text) focus:outline-none mono ${
                      exceedsAvailableCash 
                        ? 'border-(--color-error) focus:border-(--color-error) focus:ring-1 focus:ring-(--color-error)' 
                        : 'border-(--color-border) focus:border-(--color-accent)'
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  {selectedMemberId && loanAmount && (
                    <p className="text-xs text-(--color-text-muted)">
                      {loanToBalanceRatio.toFixed(1)}% of member balance
                    </p>
                  )}
                  {exceedsAvailableCash && (
                    <p className="text-xs text-(--color-error) flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Exceeds available cash
                    </p>
                  )}
                </div>
              </div>

              {/* Loan Type Indicator */}
              {selectedMemberId && loanAmount && (
                <div className={`p-4 rounded-xl border ${
                  requiresCollateral 
                    ? 'bg-(--color-warning)/5 border-(--color-warning)/30' 
                    : 'bg-(--color-success)/5 border-(--color-success)/30'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {requiresCollateral ? (
                      <>
                        <Shield className="w-5 h-5 text-(--color-warning)" />
                        <span className="font-medium text-(--color-warning)">Secured Loan</span>
                      </>
                    ) : (
                      <>
                        <ShieldOff className="w-5 h-5 text-(--color-success)" />
                        <span className="font-medium text-(--color-success)">Unsecured Loan</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-(--color-text-secondary)">
                    {requiresCollateral 
                      ? `Loan exceeds ${lendingStore.settings.collateralThreshold * 100}% threshold. Collateral is required.`
                      : `Loan is within ${lendingStore.settings.collateralThreshold * 100}% threshold. No collateral needed.`
                    }
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-(--color-border)">
                    <span className="text-sm text-(--color-text-muted)">Interest Rate</span>
                    <span className={`font-bold mono ${requiresCollateral ? 'text-(--color-warning)' : 'text-(--color-success)'}`}>
                      {currentInterestRate}%
                    </span>
                  </div>
                </div>
              )}

              {/* Collateral Section - Only show when required */}
              {requiresCollateral && (
                <div className="space-y-4 p-4 rounded-xl bg-(--color-warning)/5 border border-(--color-warning)/30">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-(--color-warning)" />
                    <span className="font-medium text-(--color-warning)">Collateral Required</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                      Collateral Type
                    </label>
                    <select
                      value={collateralType}
                      onChange={(e) => setCollateralType(e.target.value as Collateral['type'])}
                      className="w-full px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-warning) focus:outline-none"
                    >
                      <option value="land">Land/Property</option>
                      <option value="investment">Investment</option>
                      <option value="shares">Shares/Units</option>
                      <option value="other">Other Asset</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                      Collateral Description
                    </label>
                    <input
                      type="text"
                      value={collateralDescription}
                      onChange={(e) => setCollateralDescription(e.target.value)}
                      placeholder="e.g., Plot at Lekki Phase 2, Block A"
                      className="w-full px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-warning) focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                      Estimated Value
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-muted)">₦</span>
                      <input
                        type="number"
                        min="0"
                        value={collateralValue}
                        onChange={(e) => setCollateralValue(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 pl-8 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-warning) focus:outline-none mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                  Term (months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={loanTermMonths}
                  onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none mono"
                />
              </div>

              {loanAmount && loanTermMonths && (
                <div className="p-4 rounded-xl bg-(--color-accent)/10 border border-(--color-accent)/30">
                  <p className="text-sm text-(--color-text-muted) mb-2">Loan Summary</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-(--color-text-secondary)">Principal</span>
                      <span className="mono text-(--color-text)">{formatNaira(Number(loanAmount))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-(--color-text-secondary)">Interest Rate</span>
                      <span className={`mono ${requiresCollateral ? 'text-(--color-warning)' : 'text-(--color-success)'}`}>
                        {currentInterestRate}% ({requiresCollateral ? 'Secured' : 'Unsecured'})
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-(--color-text-secondary)">Interest Amount</span>
                      <span className="mono text-(--color-gold)">
                        {formatNaira(Number(loanAmount) * (currentInterestRate / 100) * (loanTermMonths / 12))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t border-(--color-border)">
                      <span className="text-(--color-text)">Total Due</span>
                      <span className="mono text-(--color-accent)">
                        {formatNaira(Number(loanAmount) * (1 + (currentInterestRate / 100) * (loanTermMonths / 12)))}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={loanNotes}
                  onChange={(e) => setLoanNotes(e.target.value)}
                  placeholder="Add any notes about this loan..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-accent) focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-(--color-border) flex gap-3">
              <button
                onClick={() => setShowNewLoanModal(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-(--color-surface-elevated) text-(--color-text) font-medium hover:bg-(--color-surface-elevated)/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateLoan}
                disabled={!selectedMemberId || !loanAmount || exceedsAvailableCash || (requiresCollateral && (!collateralDescription || !collateralValue))}
                className="flex-1 px-4 py-3 rounded-xl bg-(--color-accent) text-(--color-primary-dark) font-medium hover:bg-(--color-accent)/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Loan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedLoan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-(--color-surface) rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-(--color-border)">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-(--color-text)">Record Payment</h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedLoan(null);
                  }}
                  className="p-2 rounded-lg hover:bg-(--color-surface-elevated) text-(--color-text-muted)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-(--color-surface-elevated)">
                <p className="text-sm text-(--color-text-muted)">Recording payment for</p>
                <p className="font-semibold text-(--color-text)">{selectedLoan.borrowerName}</p>
                <p className="text-sm text-(--color-text-secondary) mt-1">
                  Outstanding: {formatNaira(selectedLoan.totalDue - selectedLoan.amountPaid)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                  Payment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-muted)">₦</span>
                  <input
                    type="number"
                    min="0"
                    max={selectedLoan.totalDue - selectedLoan.amountPaid}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-4 py-3 pl-8 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-success) focus:outline-none mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--color-text-secondary) mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="Payment reference or notes..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-(--color-primary-dark) border border-(--color-border) text-(--color-text) focus:border-(--color-success) focus:outline-none resize-none"
                />
              </div>

              {Number(paymentAmount) >= selectedLoan.totalDue - selectedLoan.amountPaid && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-(--color-success)/10 text-(--color-success)">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">This payment will fully settle the loan</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-(--color-border) flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedLoan(null);
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-(--color-surface-elevated) text-(--color-text) font-medium hover:bg-(--color-surface-elevated)/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                disabled={!paymentAmount || Number(paymentAmount) <= 0}
                className="flex-1 px-4 py-3 rounded-xl bg-(--color-success) text-(--color-primary-dark) font-medium hover:bg-(--color-success)/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
