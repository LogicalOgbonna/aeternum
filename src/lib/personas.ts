import { Member, FundState, MemberProfile, InvestmentProduct, InvestmentType, ExpenseSetting, ExpenseCategory, ExpenseOccurrence } from './types';

// Initial 10 personas with realistic Nigerian profiles
export const initialPersonas: Member[] = [
  {
    id: 'member-1',
    name: 'Tunde Adebayo',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-2',
    name: 'Kemi Ogunleye',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-3',
    name: 'Chinedu Okafor',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-4',
    name: 'Aisha Bello',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-5',
    name: 'Sola Martins',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-6',
    name: 'Emeka Nwoye',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-7',
    name: 'Yewande Ajayi',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-8',
    name: 'Ibrahim Musa',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-9',
    name: 'Funmi Adebola',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-10',
    name: 'Kunle Lawal',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-11',
    name: 'Ngozi Eze',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
  {
    id: 'member-12',
    name: 'Olumide Fashola',
    profile: 'consistent',
    baseContribution: 1_000_000,
    varianceRange: [1.0, 1.0], // ₦1m monthly
    joinedMonth: 0,
    isActive: true,
  },
];

// Generate contribution amount based on member profile
export function generateContribution(member: Member, month: number): number {
  const { profile, baseContribution, varianceRange } = member;
  
  // Quarterly contributors only pay every 3 months
  if (profile === 'quarterly' && month % 3 !== 0) {
    return 0;
  }
  
  // Lumpy contributors have 30% chance of not contributing
  if (profile === 'lumpy' && Math.random() < 0.3) {
    return 0;
  }
  
  // Generate random variance within range
  const [minVar, maxVar] = varianceRange;
  const variance = minVar + Math.random() * (maxVar - minVar);
  
  // Round to nearest 50,000 for realism
  const amount = Math.round((baseContribution * variance) / 50_000) * 50_000;
  
  return Math.max(0, amount);
}

// Available investment products in Nigeria
export const investmentProducts: InvestmentProduct[] = [
  {
    type: 'money_market',
    name: 'AXA Mansard Money Market Fund',
    description: 'Low-risk money market fund with competitive returns. Ideal for short-term parking of funds.',
    annualReturnRate: 0.18, // 18% p.a.
    riskLevel: 'low',
    liquidityDays: 1,
    minInvestment: 100_000,
  },
  {
    type: 'money_market',
    name: 'Stanbic IBTC Money Market Fund',
    description: 'Diversified money market fund investing in short-term instruments.',
    annualReturnRate: 0.16, // 16% p.a.
    riskLevel: 'low',
    liquidityDays: 1,
    minInvestment: 50_000,
  },
  {
    type: 'treasury_bills',
    name: 'Nigerian Treasury Bills (91-Day)',
    description: 'Government-backed short-term securities. Very safe but lower returns.',
    annualReturnRate: 0.12, // 12% p.a.
    riskLevel: 'low',
    liquidityDays: 91,
    minInvestment: 50_000,
  },
  {
    type: 'treasury_bills',
    name: 'Nigerian Treasury Bills (364-Day)',
    description: 'One-year government securities with slightly higher returns.',
    annualReturnRate: 0.14, // 14% p.a.
    riskLevel: 'low',
    liquidityDays: 364,
    minInvestment: 50_000,
  },
  {
    type: 'fixed_deposit',
    name: 'GTBank Fixed Deposit (12 months)',
    description: 'Bank fixed deposit with guaranteed returns. Penalty for early withdrawal.',
    annualReturnRate: 0.13, // 13% p.a.
    riskLevel: 'low',
    liquidityDays: 365,
    minInvestment: 1_000_000,
  },
  {
    type: 'fixed_deposit',
    name: 'Zenith Bank Fixed Deposit (6 months)',
    description: 'Medium-term fixed deposit with competitive rates.',
    annualReturnRate: 0.11, // 11% p.a.
    riskLevel: 'low',
    liquidityDays: 180,
    minInvestment: 500_000,
  },
  {
    type: 'mutual_fund',
    name: 'ARM Aggressive Growth Fund',
    description: 'Equity-focused fund for higher growth potential. Higher risk, higher reward.',
    annualReturnRate: 0.22, // 22% p.a. (variable)
    riskLevel: 'high',
    liquidityDays: 3,
    minInvestment: 100_000,
  },
  {
    type: 'mutual_fund',
    name: 'Afrinvest Equity Fund',
    description: 'Balanced equity fund with exposure to Nigerian stocks.',
    annualReturnRate: 0.20, // 20% p.a. (variable)
    riskLevel: 'medium',
    liquidityDays: 3,
    minInvestment: 50_000,
  },
  {
    type: 'mutual_fund',
    name: 'FBN Fixed Income Fund',
    description: 'Bond-focused fund with stable returns. Lower risk than equities.',
    annualReturnRate: 0.15, // 15% p.a.
    riskLevel: 'low',
    liquidityDays: 2,
    minInvestment: 100_000,
  },
];

// Investment type labels and colors
export const investmentTypeLabels: Record<InvestmentType, string> = {
  money_market: 'Money Market Fund',
  treasury_bills: 'Treasury Bills',
  fixed_deposit: 'Fixed Deposit',
  mutual_fund: 'Mutual Fund',
  land: 'Real Estate',
};

export const investmentTypeColors: Record<InvestmentType, string> = {
  money_market: '#00D9A5', // Teal
  treasury_bills: '#3B82F6', // Blue
  fixed_deposit: '#8B5CF6', // Purple
  mutual_fund: '#F59E0B', // Amber
  land: '#10B981', // Green
};

export const riskLevelColors: Record<'low' | 'medium' | 'high', string> = {
  low: '#10B981',    // Green
  medium: '#F59E0B', // Amber
  high: '#EF4444',   // Red
};

// Default expense settings
export const defaultExpenseSettings: ExpenseSetting[] = [
  {
    id: 'expense-legal',
    category: 'legal',
    name: 'Legal Retainer',
    amount: 50_000, // ₦50,000/month
    occurrence: 'monthly',
    isActive: true,
  },
  {
    id: 'expense-accountant',
    category: 'accountant',
    name: 'Accounting Services',
    amount: 75_000, // ₦75,000/month
    occurrence: 'monthly',
    isActive: true,
  },
  {
    id: 'expense-admin',
    category: 'admin',
    name: 'Administrative Costs',
    amount: 25_000, // ₦25,000/month
    occurrence: 'monthly',
    isActive: true,
  },
  {
    id: 'expense-management',
    category: 'management',
    name: 'Fund Management Fee',
    amount: 100_000, // ₦100,000/month
    occurrence: 'monthly',
    isActive: false, // Disabled by default
  },
  {
    id: 'expense-audit',
    category: 'accountant',
    name: 'Annual Audit',
    amount: 100_000, // ₦100,000/year
    occurrence: 'yearly',
    isActive: true,
  },
  {
    id: 'expense-agm',
    category: 'admin',
    name: 'Annual General Meeting',
    amount: 50_000, // ₦50,000/year
    occurrence: 'yearly',
    isActive: true,
  },
];

// Expense occurrence labels
export const expenseOccurrenceLabels: Record<ExpenseOccurrence, string> = {
  monthly: 'Monthly',
  yearly: 'Yearly',
  one_off: 'One-Off',
};

// Expense category labels and colors
export const expenseCategoryLabels: Record<ExpenseCategory, string> = {
  legal: 'Legal',
  accountant: 'Accounting',
  admin: 'Administrative',
  management: 'Management',
  other: 'Other',
};

export const expenseCategoryColors: Record<ExpenseCategory, string> = {
  legal: '#8B5CF6',    // Purple
  accountant: '#3B82F6', // Blue
  admin: '#F59E0B',    // Amber
  management: '#10B981', // Green
  other: '#64748B',    // Gray
};

// Initial fund state with Month 0 data
export function createInitialFundState(): FundState {
  const startDate = new Date();
  startDate.setDate(1); // First of current month
  
  return {
    fundName: 'Aeternum Limited',
    startDate,
    initialUnitPrice: 1000, // ₦1,000 per unit
    
    currentMonth: 0,
    totalUnits: 0,
    nav: 0,
    unitPrice: 1000,
    
    moneyMarketBalance: 0,
    moneyMarketRate: 0.18, // 18% annual (AXA Mansard MMF)
    liquidityPoolPercentage: 0.15, // 15% kept liquid
    
    members: [...initialPersonas],
    contributions: [],
    investments: [], // Investment vehicles
    landAssets: [],
    monthSnapshots: [],
    events: [],
    dividends: [], // Yearly dividend distributions
    expenseRecords: [], // All expense records
    
    defaultPenaltyRate: 0.05, // 5% penalty
    lockInPeriodMonths: 60, // 5 years
    landAppreciationRange: [0.15, 0.25], // 15-25% annual
    dividendPercentage: 0.20, // 20% of profit distributed as dividends
    expenseSettings: defaultExpenseSettings, // Monthly recurring expenses
  };
}

// Profile descriptions for UI
export const profileDescriptions: Record<MemberProfile, string> = {
  consistent: 'Reliable monthly contributor with minimal variance',
  variable: 'Contributes regularly but amounts fluctuate with cashflow',
  irregular: 'Income-dependent contributions, can vary significantly',
  quarterly: 'Contributes every 3 months in larger amounts',
  lumpy: 'Irregular pattern - may skip months but pays large when able',
};

// Color coding for profiles
export const profileColors: Record<MemberProfile, string> = {
  consistent: '#10B981', // Green
  variable: '#F59E0B', // Amber
  irregular: '#EF4444', // Red
  quarterly: '#8B5CF6', // Purple
  lumpy: '#EC4899', // Pink
};

