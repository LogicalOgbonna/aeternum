// Core Types for Investment Group Simulator

export type MemberProfile = 'consistent' | 'variable' | 'irregular' | 'quarterly' | 'lumpy';

export type ExitMethod = 'fund_payout' | 'company_buyback' | 'individual_buyback';

export interface Member {
  id: string;
  name: string;
  profile: MemberProfile;
  baseContribution: number; // Base monthly contribution amount
  varianceRange: [number, number]; // [min%, max%] of base contribution
  joinedMonth: number; // Month index when member joined
  isActive: boolean;
  exitedMonth?: number;
  exitReason?: 'voluntary' | 'default' | 'death' | 'forced';
  exitMethod?: ExitMethod;
  boughtByMemberId?: string; // For individual buyback - who bought the shares
}

export interface Contribution {
  memberId: string;
  month: number;
  amount: number;
  unitsIssued: number;
  unitPrice: number;
  timestamp: Date;
}

export interface MemberBalance {
  memberId: string;
  totalUnits: number;
  totalContributed: number;
  ownershipPercentage: number;
  currentValue: number;
}

export interface LandAsset {
  id: string;
  name: string;
  location: string;
  purchasePrice: number;
  purchaseMonth: number;
  currentValue: number;
  appreciationRate: number; // Annual appreciation rate (e.g., 0.20 for 20%)
  status: 'held' | 'sold' | 'developing';
  soldPrice?: number;
  soldMonth?: number;
}

// Investment vehicle types
export type InvestmentType = 
  | 'money_market'      // e.g., AXA Mansard MMF
  | 'treasury_bills'    // Nigerian T-Bills
  | 'fixed_deposit'     // Bank fixed deposits
  | 'mutual_fund'       // Equity/Bond mutual funds
  | 'land';             // Real estate

export interface InvestmentVehicle {
  id: string;
  type: InvestmentType;
  name: string;
  description: string;
  principal: number;           // Initial investment amount
  currentValue: number;        // Current value including returns
  annualReturnRate: number;    // Expected annual return (e.g., 0.18 for 18%)
  startMonth: number;          // When investment was made
  maturityMonth?: number;      // For fixed-term investments
  isActive: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  liquidityDays: number;       // Days to liquidate (0 for instant)
}

// Predefined investment products
export interface InvestmentProduct {
  type: InvestmentType;
  name: string;
  description: string;
  annualReturnRate: number;
  riskLevel: 'low' | 'medium' | 'high';
  liquidityDays: number;
  minInvestment: number;
}

export interface Investment {
  id: string;
  type: 'money_market' | 'land';
  name: string;
  amount: number;
  startMonth: number;
  annualReturn: number; // For money market
  currentValue: number;
}

export interface MonthSnapshot {
  month: number;
  date: Date;
  totalContributions: number;
  totalUnits: number;
  unitPrice: number;
  nav: number;
  moneyMarketValue: number;
  investmentsValue: number; // Total value of all investments
  landValue: number;
  interestEarned: number;
  investmentReturns: number; // Returns from all investments
  landAppreciation: number;
  expensesDeducted: number; // Total expenses deducted this month
  contributions: Contribution[];
  events: SimulationEvent[];
}

export interface SimulationEvent {
  id: string;
  month: number;
  type: 'member_joined' | 'member_exited' | 'member_defaulted' | 'land_purchased' | 'land_sold' | 'dividend_paid' | 'emergency_withdrawal' | 'investment_made' | 'investment_liquidated' | 'shares_buyback';
  description: string;
  details: Record<string, unknown>;
  timestamp: Date;
}

export interface FundState {
  // Fund info
  fundName: string;
  startDate: Date;
  initialUnitPrice: number;
  
  // Current state
  currentMonth: number;
  totalUnits: number;
  nav: number;
  unitPrice: number;
  
  // Allocations
  moneyMarketBalance: number;
  moneyMarketRate: number; // Annual rate (e.g., 0.18 for 18%)
  liquidityPoolPercentage: number;
  
  // Data
  members: Member[];
  contributions: Contribution[];
  investments: InvestmentVehicle[]; // All investment vehicles
  landAssets: LandAsset[];
  monthSnapshots: MonthSnapshot[];
  events: SimulationEvent[];
  dividends: Dividend[]; // Yearly dividend distributions
  expenseRecords: ExpenseRecord[]; // All expense records
  
  // Settings
  defaultPenaltyRate: number;
  lockInPeriodMonths: number;
  landAppreciationRange: [number, number]; // [min%, max%] annual
  dividendPercentage: number; // Percentage of profit to distribute as dividends (e.g., 0.20 for 20%)
  expenseSettings: ExpenseSetting[]; // Monthly recurring expenses
}

export interface ProjectionResult {
  month: number;
  year: number;
  nav: number;
  unitPrice: number;
  totalContributions: number;
  moneyMarketValue: number;
  investmentsValue: number;
  landValue: number;
  totalMembers: number;
}

export interface Dividend {
  id: string;
  fiscalYear: number;        // Year number (1, 2, 3, etc.)
  month: number;             // Month when dividend was paid (end of fiscal year)
  totalProfit: number;       // Total profit for the year
  distributedAmount: number; // 20% of profit distributed
  reinvestedAmount: number;  // 80% of profit reinvested
  distributions: DividendDistribution[];
}

export interface DividendDistribution {
  memberId: string;
  memberName: string;
  units: number;
  ownershipPercentage: number;
  dividendAmount: number;
}

export interface MemberStatement {
  member: Member;
  contributions: Contribution[];
  totalContributed: number;
  totalUnits: number;
  currentValue: number;
  ownershipPercentage: number;
  unrealizedGain: number;
  unrealizedGainPercentage: number;
  dividends: DividendDistribution[];   // Dividends received by this member
  totalDividendsReceived: number;       // Total dividends received
}

// Expense types
export type ExpenseCategory = 'legal' | 'accountant' | 'admin' | 'management' | 'other';
export type ExpenseOccurrence = 'monthly' | 'yearly' | 'one_off';

export interface ExpenseSetting {
  id: string;
  category: ExpenseCategory;
  name: string;
  amount: number; // Amount per occurrence (monthly or yearly)
  occurrence: ExpenseOccurrence; // When expense is deducted
  isActive: boolean;
}

export interface ExpenseRecord {
  id: string;
  month: number;
  category: ExpenseCategory;
  name: string;
  amount: number;
  occurrence: ExpenseOccurrence;
  timestamp: Date;
}

