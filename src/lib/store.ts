import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FundState, Member, MemberProfile, InvestmentProduct, ExpenseSetting, ExpenseCategory, ExpenseOccurrence } from './types';
import { 
  createInitialFundState, 
} from './personas';
import {
  processMonth,
  fastForward,
  addMember,
  exitMember,
  exitMemberCompanyBuyback,
  purchaseLand,
  sellLand,
  makeInvestment,
  liquidateInvestment,
  distributeDividends,
} from './calculations';

interface FundStore extends FundState {
  // Actions
  initializeFund: () => void;
  resetFund: () => void;
  advanceMonth: () => void;
  advanceMonths: (count: number) => void;
  advanceYears: (count: number) => void;
  
  // Member actions
  addNewMember: (name: string, profile: MemberProfile, baseContribution: number) => void;
  removeMember: (memberId: string, reason: 'voluntary' | 'default' | 'death' | 'forced') => void;
  removeMemberCompanyBuyback: (memberId: string, reason: 'voluntary' | 'default' | 'death' | 'forced', allocations: { memberId: string; percentage: number }[]) => void;
  
  // Land actions
  buyLand: (name: string, location: string, price: number, appreciationRate?: number) => void;
  sellLandAsset: (landId: string) => void;
  
  // Investment actions
  invest: (product: InvestmentProduct, amount: number) => void;
  liquidate: (investmentId: string) => void;
  
  // Settings actions
  setDividendPercentage: (percentage: number) => void;
  payDividends: () => void;
  
  // Expense actions
  addExpense: (category: ExpenseCategory, name: string, amount: number, occurrence: ExpenseOccurrence) => void;
  updateExpense: (id: string, updates: Partial<ExpenseSetting>) => void;
  removeExpense: (id: string) => void;
  toggleExpense: (id: string) => void;
  
  // Utility
  isInitialized: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useFundStore = create<FundStore>()(
  persist(
    (set, get) => ({
      // Initial empty state
      ...createInitialFundState(),
      isInitialized: false,
      _hasHydrated: false,
      
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
      
      // Initialize fund with first month processed
      initializeFund: () => {
        const initialState = createInitialFundState();
        // Process month 0 to get initial contributions
        const stateAfterMonth0 = processMonth(initialState);
        set({ ...stateAfterMonth0, isInitialized: true });
      },
      
      // Reset to initial state
      resetFund: () => {
        const initialState = createInitialFundState();
        const stateAfterMonth0 = processMonth(initialState);
        set({ ...stateAfterMonth0, isInitialized: true });
      },
      
      // Advance by one month
      advanceMonth: () => {
        const currentState = get();
        const newState = processMonth(currentState);
        set(newState);
      },
      
      // Advance by multiple months
      advanceMonths: (count: number) => {
        const currentState = get();
        const newState = fastForward(currentState, count);
        set(newState);
      },
      
      // Advance by years
      advanceYears: (count: number) => {
        const currentState = get();
        const newState = fastForward(currentState, count * 12);
        set(newState);
      },
      
      // Add a new member
      addNewMember: (name: string, profile: MemberProfile, baseContribution: number) => {
        const currentState = get();
        const varianceRange = getVarianceRangeForProfile(profile);
        const newMember: Omit<Member, 'id' | 'joinedMonth' | 'isActive'> = {
          name,
          profile,
          baseContribution,
          varianceRange,
        };
        const newState = addMember(currentState, newMember);
        set(newState);
      },
      
      // Remove a member (fund payout)
      removeMember: (memberId: string, reason: 'voluntary' | 'default' | 'death' | 'forced') => {
        const currentState = get();
        const newState = exitMember(currentState, memberId, reason);
        set(newState);
      },
      
      // Remove a member (company buyback - shares distributed to selected members based on their allocations)
      removeMemberCompanyBuyback: (memberId: string, reason: 'voluntary' | 'default' | 'death' | 'forced', allocations: { memberId: string; percentage: number }[]) => {
        const currentState = get();
        const newState = exitMemberCompanyBuyback(currentState, memberId, reason, allocations);
        set(newState);
      },
      
      // Buy land
      buyLand: (name: string, location: string, price: number, appreciationRate?: number) => {
        const currentState = get();
        const newState = purchaseLand(currentState, name, location, price, appreciationRate);
        set(newState);
      },
      
      // Sell land
      sellLandAsset: (landId: string) => {
        const currentState = get();
        const newState = sellLand(currentState, landId);
        set(newState);
      },
      
      // Make investment
      invest: (product: InvestmentProduct, amount: number) => {
        const currentState = get();
        const newState = makeInvestment(currentState, product, amount);
        set(newState);
      },
      
      // Liquidate investment
      liquidate: (investmentId: string) => {
        const currentState = get();
        const newState = liquidateInvestment(currentState, investmentId);
        set(newState);
      },
      
      // Set dividend percentage
      setDividendPercentage: (percentage: number) => {
        set({ dividendPercentage: percentage });
      },
      
      // Manually pay dividends
      payDividends: () => {
        const currentState = get();
        const newState = distributeDividends(currentState);
        set(newState);
      },
      
      // Add new expense
      addExpense: (category: ExpenseCategory, name: string, amount: number, occurrence: ExpenseOccurrence) => {
        const currentState = get();
        const newExpense: ExpenseSetting = {
          id: `expense-${Date.now()}`,
          category,
          name,
          amount,
          occurrence,
          isActive: true,
        };
        set({
          expenseSettings: [...(currentState.expenseSettings || []), newExpense],
        });
      },
      
      // Update expense
      updateExpense: (id: string, updates: Partial<ExpenseSetting>) => {
        const currentState = get();
        set({
          expenseSettings: (currentState.expenseSettings || []).map(e =>
            e.id === id ? { ...e, ...updates } : e
          ),
        });
      },
      
      // Remove expense
      removeExpense: (id: string) => {
        const currentState = get();
        set({
          expenseSettings: (currentState.expenseSettings || []).filter(e => e.id !== id),
        });
      },
      
      // Toggle expense active state
      toggleExpense: (id: string) => {
        const currentState = get();
        set({
          expenseSettings: (currentState.expenseSettings || []).map(e =>
            e.id === id ? { ...e, isActive: !e.isActive } : e
          ),
        });
      },
    }),
    {
      name: 'fund-simulator-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fundName: state.fundName,
        startDate: state.startDate,
        initialUnitPrice: state.initialUnitPrice,
        currentMonth: state.currentMonth,
        totalUnits: state.totalUnits,
        nav: state.nav,
        unitPrice: state.unitPrice,
        moneyMarketBalance: state.moneyMarketBalance,
        moneyMarketRate: state.moneyMarketRate,
        liquidityPoolPercentage: state.liquidityPoolPercentage,
        members: state.members,
        contributions: state.contributions,
        investments: state.investments,
        landAssets: state.landAssets,
        monthSnapshots: state.monthSnapshots,
        events: state.events,
        dividends: state.dividends,
        expenseRecords: state.expenseRecords,
        defaultPenaltyRate: state.defaultPenaltyRate,
        lockInPeriodMonths: state.lockInPeriodMonths,
        landAppreciationRange: state.landAppreciationRange,
        dividendPercentage: state.dividendPercentage,
        expenseSettings: state.expenseSettings,
        isInitialized: state.isInitialized,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// Helper function to get variance range for profile
function getVarianceRangeForProfile(profile: MemberProfile): [number, number] {
  switch (profile) {
    case 'consistent':
      return [0.95, 1.05];
    case 'variable':
      return [0.67, 1.33];
    case 'irregular':
      return [0.4, 1.6];
    case 'quarterly':
      return [0, 1];
    case 'lumpy':
      return [0, 2];
    default:
      return [1, 1];
  }
}

