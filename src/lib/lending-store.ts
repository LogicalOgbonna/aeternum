import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Loan, LoanPayment, LendingSettings, LoanStatus, LoanType, Collateral } from './types';

interface LendingStore {
  // State
  loans: Loan[];
  settings: LendingSettings;
  
  // Actions
  createLoan: (params: {
    borrowerMemberId: string;
    borrowerName: string;
    principal: number;
    borrowerBalance: number;
    termMonths: number;
    collateral?: Collateral;
    notes?: string;
  }) => void;
  
  recordPayment: (
    loanId: string,
    amount: number,
    confirmedBy?: string,
    notes?: string
  ) => void;
  
  updateLoanStatus: (loanId: string, status: LoanStatus) => void;
  
  cancelLoan: (loanId: string) => void;
  
  updateSettings: (settings: Partial<LendingSettings>) => void;
  
  // Computed
  getActiveLoansByMember: (memberId: string) => Loan[];
  getTotalOutstanding: () => number;
  getTotalLent: () => number;
  getTotalRepaid: () => number;
  
  // Helpers
  getLoanType: (principal: number, borrowerBalance: number) => LoanType;
  getInterestRate: (loanType: LoanType) => number;
  requiresCollateral: (principal: number, borrowerBalance: number) => boolean;
  
  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const defaultSettings: LendingSettings = {
  unsecuredInterestRate: 0.10,   // 10% annual for loans ≤50% of balance
  securedInterestRate: 0.18,     // 18% annual for loans >50% of balance
  defaultLoanTermMonths: 12,
  collateralThreshold: 0.5,      // 50% - loans above this require collateral
  maxLoanPercentage: 1.0,        // 100% of member balance max
};

// Helper to migrate old settings format to new format
const migrateSettings = (settings: Partial<LendingSettings> & { defaultInterestRate?: number }): LendingSettings => {
  // If old format with single defaultInterestRate, migrate to new format
  if (settings.defaultInterestRate !== undefined && settings.unsecuredInterestRate === undefined) {
    return {
      unsecuredInterestRate: settings.defaultInterestRate * 0.7, // Lower rate for unsecured
      securedInterestRate: settings.defaultInterestRate * 1.2,   // Higher rate for secured
      defaultLoanTermMonths: settings.defaultLoanTermMonths ?? 12,
      collateralThreshold: settings.maxLoanPercentage ?? 0.5,
      maxLoanPercentage: 1.0,
    };
  }
  // Return settings with defaults filled in
  return {
    unsecuredInterestRate: settings.unsecuredInterestRate ?? defaultSettings.unsecuredInterestRate,
    securedInterestRate: settings.securedInterestRate ?? defaultSettings.securedInterestRate,
    defaultLoanTermMonths: settings.defaultLoanTermMonths ?? defaultSettings.defaultLoanTermMonths,
    collateralThreshold: settings.collateralThreshold ?? defaultSettings.collateralThreshold,
    maxLoanPercentage: settings.maxLoanPercentage ?? defaultSettings.maxLoanPercentage,
  };
};

export const useLendingStore = create<LendingStore>()(
  persist(
    (set, get) => ({
      loans: [],
      settings: defaultSettings,
      _hasHydrated: false,
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
      
      getLoanType: (principal: number, borrowerBalance: number): LoanType => {
        const { settings } = get();
        const ratio = borrowerBalance > 0 ? principal / borrowerBalance : 1;
        return ratio <= settings.collateralThreshold ? 'unsecured' : 'secured';
      },
      
      getInterestRate: (loanType: LoanType): number => {
        const { settings } = get();
        return loanType === 'unsecured' 
          ? settings.unsecuredInterestRate 
          : settings.securedInterestRate;
      },
      
      requiresCollateral: (principal: number, borrowerBalance: number): boolean => {
        const { settings } = get();
        const ratio = borrowerBalance > 0 ? principal / borrowerBalance : 1;
        return ratio > settings.collateralThreshold;
      },
      
      createLoan: ({
        borrowerMemberId,
        borrowerName,
        principal,
        borrowerBalance,
        termMonths,
        collateral,
        notes,
      }) => {
        const { getLoanType, getInterestRate } = get();
        
        const loanToBalanceRatio = borrowerBalance > 0 ? principal / borrowerBalance : 1;
        const loanType = getLoanType(principal, borrowerBalance);
        const interestRate = getInterestRate(loanType);
        
        const startDate = new Date();
        const dueDate = new Date();
        dueDate.setMonth(dueDate.getMonth() + termMonths);
        
        // Calculate total due with simple interest
        const interest = principal * interestRate * (termMonths / 12);
        const totalDue = principal + interest;
        
        const newLoan: Loan = {
          id: `loan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          borrowerMemberId,
          borrowerName,
          principal,
          interestRate,
          totalDue,
          amountPaid: 0,
          startDate,
          dueDate,
          status: 'active',
          payments: [],
          notes,
          // New collateral fields
          loanType,
          borrowerBalanceAtLoan: borrowerBalance,
          loanToBalanceRatio,
          collateral: loanType === 'secured' ? collateral : undefined,
        };
        
        set((state) => ({
          loans: [...state.loans, newLoan],
        }));
      },
      
      recordPayment: (loanId, amount, confirmedBy, notes) => {
        const payment: LoanPayment = {
          id: `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          loanId,
          amount,
          paymentDate: new Date(),
          confirmedBy,
          notes,
        };
        
        set((state) => ({
          loans: state.loans.map((loan) => {
            if (loan.id !== loanId) return loan;
            
            const newAmountPaid = loan.amountPaid + amount;
            const isPaid = newAmountPaid >= loan.totalDue;
            
            return {
              ...loan,
              amountPaid: newAmountPaid,
              status: isPaid ? 'paid' : loan.status,
              payments: [...loan.payments, payment],
            };
          }),
        }));
      },
      
      updateLoanStatus: (loanId, status) => {
        set((state) => ({
          loans: state.loans.map((loan) =>
            loan.id === loanId ? { ...loan, status } : loan
          ),
        }));
      },
      
      cancelLoan: (loanId) => {
        set((state) => ({
          loans: state.loans.map((loan) =>
            loan.id === loanId ? { ...loan, status: 'cancelled' } : loan
          ),
        }));
      },
      
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },
      
      getActiveLoansByMember: (memberId) => {
        return get().loans.filter(
          (loan) => loan.borrowerMemberId === memberId && loan.status === 'active'
        );
      },
      
      getTotalOutstanding: () => {
        return get().loans
          .filter((loan) => loan.status === 'active')
          .reduce((sum, loan) => sum + (loan.totalDue - loan.amountPaid), 0);
      },
      
      getTotalLent: () => {
        return get().loans
          .filter((loan) => loan.status !== 'cancelled')
          .reduce((sum, loan) => sum + loan.principal, 0);
      },
      
      getTotalRepaid: () => {
        return get().loans.reduce((sum, loan) => sum + loan.amountPaid, 0);
      },
    }),
    {
      name: 'fund-lending-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Migrate old settings format if needed
          state.settings = migrateSettings(state.settings);
          
          // Migrate old loans that don't have loanType field
          state.loans = state.loans.map((loan) => {
            if (!loan.loanType) {
              return {
                ...loan,
                loanType: 'unsecured' as const, // Default to unsecured for old loans
                borrowerBalanceAtLoan: loan.principal * 2, // Assume 50% ratio
                loanToBalanceRatio: 0.5,
              };
            }
            return loan;
          });
          
          state.setHasHydrated(true);
        }
      },
    }
  )
);
