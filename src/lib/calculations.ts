import {
  FundState,
  Member,
  Contribution,
  MonthSnapshot,
  MemberBalance,
  LandAsset,
  SimulationEvent,
  ProjectionResult,
  MemberStatement,
  InvestmentVehicle,
  InvestmentProduct,
  Dividend,
  DividendDistribution,
  ExpenseRecord,
} from './types';
import { generateContribution } from './personas';

// Format currency in Naira
export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// Calculate units from contribution
export function calculateUnits(contribution: number, unitPrice: number): number {
  if (unitPrice <= 0) return 0;
  return contribution / unitPrice;
}

// Calculate current unit price
export function calculateUnitPrice(nav: number, totalUnits: number): number {
  if (totalUnits <= 0) return 1000; // Default initial price
  return nav / totalUnits;
}

// Calculate monthly interest from money market
export function calculateMonthlyInterest(principal: number, annualRate: number): number {
  const monthlyRate = annualRate / 12;
  return principal * monthlyRate;
}

// Calculate land appreciation for a month
export function calculateMonthlyLandAppreciation(
  currentValue: number,
  annualRate: number
): number {
  // Monthly compound rate
  const monthlyRate = Math.pow(1 + annualRate, 1/12) - 1;
  return currentValue * monthlyRate;
}

// Get member balances
export function getMemberBalances(state: FundState): MemberBalance[] {
  const balances: Map<string, MemberBalance> = new Map();
  
  // Initialize balances for all members
  state.members.forEach(member => {
    balances.set(member.id, {
      memberId: member.id,
      totalUnits: 0,
      totalContributed: 0,
      ownershipPercentage: 0,
      currentValue: 0,
    });
  });
  
  // Sum up contributions
  state.contributions.forEach(contribution => {
    const balance = balances.get(contribution.memberId);
    if (balance) {
      balance.totalUnits += contribution.unitsIssued;
      balance.totalContributed += contribution.amount;
    }
  });
  
  // Calculate ownership percentages and current values
  const totalUnits = state.totalUnits;
  balances.forEach(balance => {
    balance.ownershipPercentage = totalUnits > 0 ? balance.totalUnits / totalUnits : 0;
    balance.currentValue = balance.totalUnits * state.unitPrice;
  });
  
  return Array.from(balances.values());
}

// Get member statement
export function getMemberStatement(state: FundState, memberId: string): MemberStatement | null {
  const member = state.members.find(m => m.id === memberId);
  if (!member) return null;
  
  const contributions = state.contributions.filter(c => c.memberId === memberId);
  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
  const totalUnits = contributions.reduce((sum, c) => sum + c.unitsIssued, 0);
  const currentValue = totalUnits * state.unitPrice;
  const ownershipPercentage = state.totalUnits > 0 ? totalUnits / state.totalUnits : 0;
  const unrealizedGain = currentValue - totalContributed;
  const unrealizedGainPercentage = totalContributed > 0 ? unrealizedGain / totalContributed : 0;
  
  // Get dividends for this member
  const dividends: DividendDistribution[] = (state.dividends || [])
    .flatMap(d => d.distributions)
    .filter(dist => dist.memberId === memberId);
  
  const totalDividendsReceived = dividends.reduce((sum, d) => sum + d.dividendAmount, 0);
  
  return {
    member,
    contributions,
    totalContributed,
    totalUnits,
    currentValue,
    ownershipPercentage,
    unrealizedGain,
    unrealizedGainPercentage,
    dividends,
    totalDividendsReceived,
  };
}

// Calculate and distribute dividends at fiscal year end
// Configurable percentage of profit is distributed, rest is reinvested
export function distributeDividends(state: FundState): FundState {
  // currentMonth is 12, 24, 36... after the year is complete
  const fiscalYear = state.currentMonth / 12;
  let newState = { ...state };
  const newEvents: SimulationEvent[] = [];
  
  // FIRST: Deduct yearly expenses before calculating profit and dividends
  const activeYearlyExpenses = (state.expenseSettings || [])
    .filter(e => e.isActive && e.occurrence === 'yearly');
  
  let yearlyExpensesDeducted = 0;
  const newExpenseRecords: ExpenseRecord[] = [];
  
  for (const expense of activeYearlyExpenses) {
    // Only deduct if we have enough balance
    if (newState.moneyMarketBalance >= expense.amount) {
      newState.moneyMarketBalance -= expense.amount;
      yearlyExpensesDeducted += expense.amount;
      
      newExpenseRecords.push({
        id: `expense-${Date.now()}-${expense.id}`,
        month: state.currentMonth,
        category: expense.category,
        name: expense.name,
        amount: expense.amount,
        occurrence: 'yearly',
        timestamp: new Date(),
      });
    }
  }
  
  newState.expenseRecords = [...(state.expenseRecords || []), ...newExpenseRecords];
  
  // Recalculate NAV after yearly expenses
  const totalLandValue = state.landAssets
    .filter(l => l.status === 'held')
    .reduce((sum, l) => sum + l.currentValue, 0);
  const totalInvestmentsValue = (state.investments || [])
    .filter(i => i.isActive)
    .reduce((sum, i) => sum + i.currentValue, 0);
  newState.nav = newState.moneyMarketBalance + totalInvestmentsValue + totalLandValue;
  newState.unitPrice = calculateUnitPrice(newState.nav, state.totalUnits);
  
  // Calculate profit for the year
  // Get the NAV at the start of the fiscal year (12 months ago)
  const startMonth = (fiscalYear - 1) * 12;
  const startSnapshot = state.monthSnapshots.find(s => s.month === startMonth);
  // For Year 1, startMonth is 0, startNAV includes month 0 contributions
  const startNAV = startSnapshot?.nav || 0;
  
  // Get contributions made AFTER the start month (startMonth + 1 to currentMonth - 1)
  // The startSnapshot NAV already includes contributions from startMonth
  const yearContributions = state.contributions
    .filter(c => c.month > startMonth && c.month < state.currentMonth)
    .reduce((sum, c) => sum + c.amount, 0);
  
  // Get all expenses for the year (to subtract from profit calculation)
  const yearExpenses = (state.expenseRecords || [])
    .filter(e => e.month > startMonth && e.month <= state.currentMonth)
    .reduce((sum, e) => sum + e.amount, 0) + yearlyExpensesDeducted;
  
  // Profit = Current NAV - Starting NAV - New Contributions + Yearly Expenses (already deducted)
  // Note: We add back expenses because they were already deducted from NAV
  const totalProfit = newState.nav - startNAV - yearContributions;
  
  // Only distribute if there's profit
  if (totalProfit <= 0) {
    return {
      ...newState,
      events: [...state.events, ...newEvents],
    };
  }
  
  // Use configurable dividend percentage (default to 20% if not set)
  const dividendRate = state.dividendPercentage ?? 0.20;
  const distributedAmount = totalProfit * dividendRate;
  const reinvestedAmount = totalProfit * (1 - dividendRate);
  
  // Calculate distributions per member based on ownership
  const memberBalances = getMemberBalances(newState);
  const activeBalances = memberBalances.filter(b => {
    const member = newState.members.find(m => m.id === b.memberId);
    return member?.isActive && b.totalUnits > 0;
  });
  
  const distributions: DividendDistribution[] = activeBalances.map(balance => {
    const member = newState.members.find(m => m.id === balance.memberId)!;
    const dividendAmount = distributedAmount * balance.ownershipPercentage;
    
    return {
      memberId: balance.memberId,
      memberName: member.name,
      units: balance.totalUnits,
      ownershipPercentage: balance.ownershipPercentage,
      dividendAmount,
    };
  });
  
  const dividend: Dividend = {
    id: `dividend-${Date.now()}`,
    fiscalYear,
    month: state.currentMonth,
    totalProfit,
    distributedAmount,
    reinvestedAmount,
    distributions,
  };
  
  // Create event
  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'dividend_paid',
    description: `Year ${fiscalYear} dividend: ${formatNaira(distributedAmount)} distributed (${(dividendRate * 100).toFixed(0)}% of ${formatNaira(totalProfit)} profit)`,
    details: {
      fiscalYear,
      totalProfit,
      distributedAmount,
      reinvestedAmount,
      dividendRate,
      yearlyExpensesDeducted,
      memberCount: distributions.length,
    },
    timestamp: new Date(),
  };
  
  // Deduct distributed amount from money market (the payout)
  newState.moneyMarketBalance -= distributedAmount;
  
  // Recalculate NAV (profit distributed reduces NAV)
  const finalNav = newState.moneyMarketBalance + totalInvestmentsValue + totalLandValue;
  
  return {
    ...newState,
    nav: finalNav,
    unitPrice: calculateUnitPrice(finalNav, state.totalUnits),
    dividends: [...(state.dividends || []), dividend],
    events: [...state.events, ...newEvents, event],
  };
}

// Process a single month of simulation
export function processMonth(state: FundState): FundState {
  const newState = { ...state };
  const month = state.currentMonth;
  const contributions: Contribution[] = [];
  const events: SimulationEvent[] = [];
  
  // Get current unit price (before new contributions)
  let currentUnitPrice = state.unitPrice;
  let totalNewContributions = 0;
  let totalNewUnits = 0;
  
  // Process contributions from active members
  state.members.filter(m => m.isActive).forEach(member => {
    const amount = generateContribution(member, month);
    
    if (amount > 0) {
      const unitsIssued = calculateUnits(amount, currentUnitPrice);
      
      const contribution: Contribution = {
        memberId: member.id,
        month,
        amount,
        unitsIssued,
        unitPrice: currentUnitPrice,
        timestamp: new Date(),
      };
      
      contributions.push(contribution);
      totalNewContributions += amount;
      totalNewUnits += unitsIssued;
    }
  });
  
  // Update total units
  newState.totalUnits = state.totalUnits + totalNewUnits;
  newState.contributions = [...state.contributions, ...contributions];
  
  // Add contributions to money market
  newState.moneyMarketBalance = state.moneyMarketBalance + totalNewContributions;
  
  // Deduct MONTHLY and ONE-OFF expenses right after contributions (including month 0)
  let expensesDeducted = 0;
  const newExpenseRecords: ExpenseRecord[] = [];
  const oneOffExpenseIds: string[] = []; // Track one-off expenses to deactivate
  
  // Get monthly and one-off expenses (both are deducted immediately)
  const activeImmediateExpenses = (state.expenseSettings || [])
    .filter(e => e.isActive && (e.occurrence === 'monthly' || e.occurrence === 'one_off'));
  
  for (const expense of activeImmediateExpenses) {
    // Only deduct if we have enough balance
    if (newState.moneyMarketBalance >= expense.amount) {
      newState.moneyMarketBalance -= expense.amount;
      expensesDeducted += expense.amount;
      
      newExpenseRecords.push({
        id: `expense-${Date.now()}-${expense.id}`,
        month,
        category: expense.category,
        name: expense.name,
        amount: expense.amount,
        occurrence: expense.occurrence,
        timestamp: new Date(),
      });
      
      // Mark one-off expenses to be deactivated after processing
      if (expense.occurrence === 'one_off') {
        oneOffExpenseIds.push(expense.id);
      }
    }
  }
  
  newState.expenseRecords = [...(state.expenseRecords || []), ...newExpenseRecords];
  
  // Deactivate one-off expenses after they've been applied
  if (oneOffExpenseIds.length > 0) {
    newState.expenseSettings = (state.expenseSettings || []).map(e => 
      oneOffExpenseIds.includes(e.id) ? { ...e, isActive: false } : e
    );
  } else {
    newState.expenseSettings = state.expenseSettings || [];
  }
  
  // Calculate interest/returns only from Month 1 onwards (Month 0 is just contributions)
  let interestEarned = 0;
  let investmentReturns = 0;
  let totalInvestmentsValue = 0;
  let landAppreciation = 0;
  let totalLandValue = 0;
  
  if (month > 0) {
    // Calculate interest earned on money market (liquid cash) - on balance AFTER expenses
    interestEarned = calculateMonthlyInterest(
      newState.moneyMarketBalance, // Interest on balance AFTER contributions and expenses
      state.moneyMarketRate
    );
    newState.moneyMarketBalance += interestEarned;
    
    // Calculate investment returns
    newState.investments = (state.investments || []).map(investment => {
      if (investment.isActive) {
        const monthlyReturn = calculateMonthlyInterest(
          investment.currentValue,
          investment.annualReturnRate
        );
        const newValue = investment.currentValue + monthlyReturn;
        investmentReturns += monthlyReturn;
        totalInvestmentsValue += newValue;
        return { ...investment, currentValue: newValue };
      }
      totalInvestmentsValue += investment.isActive ? investment.currentValue : 0;
      return investment;
    });
    
    // Calculate land appreciation
    newState.landAssets = state.landAssets.map(land => {
      if (land.status === 'held') {
        const appreciation = calculateMonthlyLandAppreciation(
          land.currentValue,
          land.appreciationRate
        );
        const newValue = land.currentValue + appreciation;
        landAppreciation += appreciation;
        totalLandValue += newValue;
        return { ...land, currentValue: newValue };
      }
      return land;
    });
  } else {
    // Month 0: No interest, just record investments and land at current value
    newState.investments = state.investments || [];
    totalInvestmentsValue = (state.investments || [])
      .filter(i => i.isActive)
      .reduce((sum, i) => sum + i.currentValue, 0);
    
    newState.landAssets = state.landAssets;
    totalLandValue = state.landAssets
      .filter(l => l.status === 'held')
      .reduce((sum, l) => sum + l.currentValue, 0);
  }
  
  // Calculate new NAV (liquid cash + investments + land)
  newState.nav = newState.moneyMarketBalance + totalInvestmentsValue + totalLandValue;
  
  // Calculate new unit price
  newState.unitPrice = calculateUnitPrice(newState.nav, newState.totalUnits);
  
  // Create month snapshot
  const snapshot: MonthSnapshot = {
    month,
    date: new Date(),
    totalContributions: totalNewContributions,
    totalUnits: newState.totalUnits,
    unitPrice: newState.unitPrice,
    nav: newState.nav,
    moneyMarketValue: newState.moneyMarketBalance,
    investmentsValue: totalInvestmentsValue,
    landValue: totalLandValue,
    interestEarned,
    investmentReturns,
    landAppreciation,
    expensesDeducted,
    contributions,
    events,
  };
  
  newState.monthSnapshots = [...state.monthSnapshots, snapshot];
  newState.currentMonth = month + 1;
  newState.events = [...state.events, ...events];
  newState.dividends = state.dividends || [];
  newState.expenseSettings = state.expenseSettings || [];
  
  // Check if this is the end of a fiscal year (every 12 months, starting from month 12)
  // Distribute dividends after processing month 11, 23, 35, etc. (completing year 1, 2, 3...)
  // At this point, newState.currentMonth is month + 1 = 12, 24, 36...
  if (newState.currentMonth > 0 && newState.currentMonth % 12 === 0) {
    // We've just completed a fiscal year (month 12, 24, 36...)
    return distributeDividends(newState);
  }
  
  return newState;
}

// Fast forward multiple months
export function fastForward(state: FundState, months: number): FundState {
  let currentState = state;
  for (let i = 0; i < months; i++) {
    currentState = processMonth(currentState);
  }
  return currentState;
}

// Add a new member
export function addMember(state: FundState, member: Omit<Member, 'id' | 'joinedMonth' | 'isActive'>): FundState {
  const newMember: Member = {
    ...member,
    id: `member-${Date.now()}`,
    joinedMonth: state.currentMonth,
    isActive: true,
  };
  
  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'member_joined',
    description: `${newMember.name} joined the fund`,
    details: { memberId: newMember.id },
    timestamp: new Date(),
  };
  
  return {
    ...state,
    members: [...state.members, newMember],
    events: [...state.events, event],
  };
}

// Calculate member's total units from contributions
export function getMemberUnits(state: FundState, memberId: string): number {
  return state.contributions
    .filter(c => c.memberId === memberId)
    .reduce((sum, c) => sum + c.unitsIssued, 0);
}

// Remove/exit a member with fund payout (original method)
export function exitMember(
  state: FundState,
  memberId: string,
  reason: 'voluntary' | 'default' | 'death' | 'forced'
): FundState {
  const member = state.members.find(m => m.id === memberId);
  if (!member) return state;
  
  // Step 1: Calculate member's total units
  const memberUnits = getMemberUnits(state, memberId);
  
  // Step 2: Calculate exit value (units × current unit price)
  const exitValue = memberUnits * state.unitPrice;
  
  // Step 3: Check liquidity - if not enough cash, we still proceed but note it
  const hasFullLiquidity = state.moneyMarketBalance >= exitValue;
  const actualPayout = hasFullLiquidity ? exitValue : state.moneyMarketBalance;
  
  // Step 4: Remove units from total
  const newTotalUnits = state.totalUnits - memberUnits;
  
  // Step 5: Reduce NAV by exit value (payout from money market)
  const newMoneyMarketBalance = Math.max(0, state.moneyMarketBalance - exitValue);
  
  // Recalculate total land value
  const totalLandValue = state.landAssets
    .filter(l => l.status === 'held')
    .reduce((sum, l) => sum + l.currentValue, 0);
  
  // New NAV = remaining money market + land value
  const newNav = newMoneyMarketBalance + totalLandValue;
  
  // Step 6: Recalculate unit price (should remain the same if done correctly)
  // Unit price = NAV / Total Units
  const newUnitPrice = newTotalUnits > 0 ? newNav / newTotalUnits : state.initialUnitPrice;
  
  // Mark member as inactive
  const updatedMembers = state.members.map(m =>
    m.id === memberId
      ? { ...m, isActive: false, exitedMonth: state.currentMonth, exitReason: reason, exitMethod: 'fund_payout' as const }
      : m
  );
  
  // Create event with full payout details
  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'member_exited',
    description: `${member.name} exited the fund (${reason}) - Fund Payout: ${formatNaira(exitValue)}`,
    details: { 
      memberId, 
      reason,
      exitMethod: 'fund_payout',
      unitsRedeemed: memberUnits,
      unitPriceAtExit: state.unitPrice,
      exitValue,
      actualPayout,
      hasFullLiquidity,
      remainingUnits: newTotalUnits,
      newOwnershipRedistributed: true,
    },
    timestamp: new Date(),
  };
  
  return {
    ...state,
    members: updatedMembers,
    totalUnits: newTotalUnits,
    moneyMarketBalance: newMoneyMarketBalance,
    nav: newNav,
    unitPrice: newUnitPrice,
    events: [...state.events, event],
  };
}

// Company buyback - shares distributed equally to all remaining active members
// All remaining members contribute proportionally to pay the exiting member
export function exitMemberCompanyBuyback(
  state: FundState,
  memberId: string,
  reason: 'voluntary' | 'default' | 'death' | 'forced'
): FundState {
  const member = state.members.find(m => m.id === memberId);
  if (!member) return state;
  
  const memberUnits = getMemberUnits(state, memberId);
  const exitValue = memberUnits * state.unitPrice;
  
  // Get remaining active members (excluding the exiting member)
  const remainingActiveMembers = state.members.filter(m => m.isActive && m.id !== memberId);
  if (remainingActiveMembers.length === 0) {
    // No remaining members to buy back, fall back to fund payout
    return exitMember(state, memberId, reason);
  }
  
  // Calculate units distributed to each remaining member (equal distribution)
  const unitsPerMember = memberUnits / remainingActiveMembers.length;
  
  // Calculate cost per member (equal contribution to pay the exiting member)
  const costPerMember = exitValue / remainingActiveMembers.length;
  
  // Create contribution records for the buyback (members buying shares)
  const buybackContributions: Contribution[] = remainingActiveMembers.map(m => ({
    memberId: m.id,
    month: state.currentMonth,
    amount: costPerMember,
    unitsIssued: unitsPerMember,
    unitPrice: state.unitPrice,
    timestamp: new Date(),
  }));
  
  // Mark exiting member as inactive
  const updatedMembers = state.members.map(m =>
    m.id === memberId
      ? { ...m, isActive: false, exitedMonth: state.currentMonth, exitReason: reason, exitMethod: 'company_buyback' as const }
      : m
  );
  
  // Total units remain the same (just redistributed)
  // NAV remains the same (members pay each other, money stays internal)
  // Unit price remains the same
  
  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'shares_buyback',
    description: `Company Buyback: ${member.name}'s ${formatNumber(memberUnits, 2)} units distributed equally to ${remainingActiveMembers.length} members for ${formatNaira(exitValue)}`,
    details: { 
      memberId,
      memberName: member.name,
      reason,
      exitMethod: 'company_buyback',
      unitsRedeemed: memberUnits,
      exitValue,
      unitsPerMember,
      costPerMember,
      buyersCount: remainingActiveMembers.length,
      buyers: remainingActiveMembers.map(m => ({ id: m.id, name: m.name })),
    },
    timestamp: new Date(),
  };
  
  return {
    ...state,
    members: updatedMembers,
    contributions: [...state.contributions, ...buybackContributions],
    events: [...state.events, event],
  };
}

// Individual buyback - a specific member buys all shares of the exiting member
export function exitMemberIndividualBuyback(
  state: FundState,
  exitingMemberId: string,
  buyingMemberId: string,
  reason: 'voluntary' | 'default' | 'death' | 'forced'
): FundState {
  const exitingMember = state.members.find(m => m.id === exitingMemberId);
  const buyingMember = state.members.find(m => m.id === buyingMemberId);
  
  if (!exitingMember || !buyingMember) return state;
  if (!buyingMember.isActive) return state;
  if (exitingMemberId === buyingMemberId) return state;
  
  const memberUnits = getMemberUnits(state, exitingMemberId);
  const exitValue = memberUnits * state.unitPrice;
  
  // Create contribution record for the buying member
  const buybackContribution: Contribution = {
    memberId: buyingMemberId,
    month: state.currentMonth,
    amount: exitValue,
    unitsIssued: memberUnits,
    unitPrice: state.unitPrice,
    timestamp: new Date(),
  };
  
  // Mark exiting member as inactive with reference to buyer
  const updatedMembers = state.members.map(m =>
    m.id === exitingMemberId
      ? { 
          ...m, 
          isActive: false, 
          exitedMonth: state.currentMonth, 
          exitReason: reason, 
          exitMethod: 'individual_buyback' as const,
          boughtByMemberId: buyingMemberId,
        }
      : m
  );
  
  // Total units remain the same (transferred, not redeemed)
  // NAV remains the same (internal transfer)
  // Unit price remains the same
  
  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'shares_buyback',
    description: `Individual Buyback: ${buyingMember.name} bought ${formatNumber(memberUnits, 2)} units from ${exitingMember.name} for ${formatNaira(exitValue)}`,
    details: { 
      exitingMemberId,
      exitingMemberName: exitingMember.name,
      buyingMemberId,
      buyingMemberName: buyingMember.name,
      reason,
      exitMethod: 'individual_buyback',
      unitsTransferred: memberUnits,
      transferValue: exitValue,
      unitPriceAtTransfer: state.unitPrice,
    },
    timestamp: new Date(),
  };
  
  return {
    ...state,
    members: updatedMembers,
    contributions: [...state.contributions, buybackContribution],
    events: [...state.events, event],
  };
}

// Purchase land
export function purchaseLand(
  state: FundState,
  name: string,
  location: string,
  price: number,
  appreciationRate?: number
): FundState {
  // Check if we have enough in money market
  if (price > state.moneyMarketBalance) {
    console.error('Insufficient funds for land purchase');
    return state;
  }
  
  // Use random appreciation rate within range if not specified
  const rate = appreciationRate ?? 
    state.landAppreciationRange[0] + 
    Math.random() * (state.landAppreciationRange[1] - state.landAppreciationRange[0]);
  
  const land: LandAsset = {
    id: `land-${Date.now()}`,
    name,
    location,
    purchasePrice: price,
    purchaseMonth: state.currentMonth,
    currentValue: price,
    appreciationRate: rate,
    status: 'held',
  };
  
  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'land_purchased',
    description: `Purchased ${name} in ${location} for ${formatNaira(price)}`,
    details: { landId: land.id, price, location },
    timestamp: new Date(),
  };
  
  return {
    ...state,
    moneyMarketBalance: state.moneyMarketBalance - price,
    landAssets: [...state.landAssets, land],
    events: [...state.events, event],
  };
}

// Sell land
export function sellLand(state: FundState, landId: string): FundState {
  const land = state.landAssets.find(l => l.id === landId);
  if (!land || land.status !== 'held') return state;
  
  const salePrice = land.currentValue;
  
  const updatedLandAssets = state.landAssets.map(l =>
    l.id === landId
      ? { ...l, status: 'sold' as const, soldPrice: salePrice, soldMonth: state.currentMonth }
      : l
  );
  
  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'land_sold',
    description: `Sold ${land.name} for ${formatNaira(salePrice)}`,
    details: { 
      landId, 
      salePrice, 
      purchasePrice: land.purchasePrice,
      profit: salePrice - land.purchasePrice 
    },
    timestamp: new Date(),
  };
  
  // Recalculate NAV
  const totalLandValue = updatedLandAssets
    .filter(l => l.status === 'held')
    .reduce((sum, l) => sum + l.currentValue, 0);
  
  const newMoneyMarket = state.moneyMarketBalance + salePrice;
  const totalInvestmentsValue = (state.investments || [])
    .filter(i => i.isActive)
    .reduce((sum, i) => sum + i.currentValue, 0);
  const newNav = newMoneyMarket + totalInvestmentsValue + totalLandValue;
  
  return {
    ...state,
    moneyMarketBalance: newMoneyMarket,
    landAssets: updatedLandAssets,
    nav: newNav,
    unitPrice: calculateUnitPrice(newNav, state.totalUnits),
    events: [...state.events, event],
  };
}

// Make an investment
export function makeInvestment(
  state: FundState,
  product: InvestmentProduct,
  amount: number
): FundState {
  // Check if we have enough in money market
  if (amount > state.moneyMarketBalance) {
    console.error('Insufficient funds for investment');
    return state;
  }

  if (amount < product.minInvestment) {
    console.error(`Minimum investment is ${formatNaira(product.minInvestment)}`);
    return state;
  }

  const investment: InvestmentVehicle = {
    id: `inv-${Date.now()}`,
    type: product.type,
    name: product.name,
    description: product.description,
    principal: amount,
    currentValue: amount,
    annualReturnRate: product.annualReturnRate,
    startMonth: state.currentMonth,
    maturityMonth: product.liquidityDays > 30 
      ? state.currentMonth + Math.ceil(product.liquidityDays / 30)
      : undefined,
    isActive: true,
    riskLevel: product.riskLevel,
    liquidityDays: product.liquidityDays,
  };

  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'investment_made',
    description: `Invested ${formatNaira(amount)} in ${product.name}`,
    details: { 
      investmentId: investment.id, 
      amount, 
      productName: product.name,
      expectedReturn: product.annualReturnRate,
    },
    timestamp: new Date(),
  };

  const newMoneyMarket = state.moneyMarketBalance - amount;
  const totalInvestmentsValue = [...(state.investments || []), investment]
    .filter(i => i.isActive)
    .reduce((sum, i) => sum + i.currentValue, 0);
  const totalLandValue = state.landAssets
    .filter(l => l.status === 'held')
    .reduce((sum, l) => sum + l.currentValue, 0);
  const newNav = newMoneyMarket + totalInvestmentsValue + totalLandValue;

  return {
    ...state,
    moneyMarketBalance: newMoneyMarket,
    investments: [...(state.investments || []), investment],
    nav: newNav,
    unitPrice: calculateUnitPrice(newNav, state.totalUnits),
    events: [...state.events, event],
  };
}

// Liquidate an investment
export function liquidateInvestment(state: FundState, investmentId: string): FundState {
  const investment = (state.investments || []).find(i => i.id === investmentId);
  if (!investment || !investment.isActive) return state;

  const liquidationValue = investment.currentValue;
  const profit = liquidationValue - investment.principal;

  const updatedInvestments = (state.investments || []).map(i =>
    i.id === investmentId
      ? { ...i, isActive: false }
      : i
  );

  const event: SimulationEvent = {
    id: `event-${Date.now()}`,
    month: state.currentMonth,
    type: 'investment_liquidated',
    description: `Liquidated ${investment.name} for ${formatNaira(liquidationValue)} (${profit >= 0 ? '+' : ''}${formatNaira(profit)} profit)`,
    details: { 
      investmentId, 
      liquidationValue,
      principal: investment.principal,
      profit,
      holdingPeriod: state.currentMonth - investment.startMonth,
    },
    timestamp: new Date(),
  };

  const newMoneyMarket = state.moneyMarketBalance + liquidationValue;
  const totalInvestmentsValue = updatedInvestments
    .filter(i => i.isActive)
    .reduce((sum, i) => sum + i.currentValue, 0);
  const totalLandValue = state.landAssets
    .filter(l => l.status === 'held')
    .reduce((sum, l) => sum + l.currentValue, 0);
  const newNav = newMoneyMarket + totalInvestmentsValue + totalLandValue;

  return {
    ...state,
    moneyMarketBalance: newMoneyMarket,
    investments: updatedInvestments,
    nav: newNav,
    unitPrice: calculateUnitPrice(newNav, state.totalUnits),
    events: [...state.events, event],
  };
}

// Get total investments value
export function getTotalInvestmentsValue(state: FundState): number {
  return (state.investments || [])
    .filter(i => i.isActive)
    .reduce((sum, i) => sum + i.currentValue, 0);
}

// Get investments by type
export function getInvestmentsByType(state: FundState): Record<string, { count: number; value: number }> {
  const result: Record<string, { count: number; value: number }> = {};
  
  (state.investments || []).filter(i => i.isActive).forEach(inv => {
    if (!result[inv.type]) {
      result[inv.type] = { count: 0, value: 0 };
    }
    result[inv.type].count++;
    result[inv.type].value += inv.currentValue;
  });
  
  return result;
}

// Generate projection
export function generateProjection(
  state: FundState,
  years: number
): ProjectionResult[] {
  const results: ProjectionResult[] = [];
  let projectedState = { ...state, investments: state.investments || [] };
  
  const totalMonths = years * 12;
  
  for (let month = 0; month < totalMonths; month++) {
    projectedState = processMonth(projectedState);
    
    // Record quarterly snapshots for performance
    if (month % 3 === 0 || month === totalMonths - 1) {
      const landValue = projectedState.landAssets
        .filter(l => l.status === 'held')
        .reduce((sum, l) => sum + l.currentValue, 0);
      
      const investmentsValue = (projectedState.investments || [])
        .filter(i => i.isActive)
        .reduce((sum, i) => sum + i.currentValue, 0);

      results.push({
        month: projectedState.currentMonth,
        year: Math.floor(projectedState.currentMonth / 12),
        nav: projectedState.nav,
        unitPrice: projectedState.unitPrice,
        totalContributions: projectedState.contributions.reduce((sum, c) => sum + c.amount, 0),
        moneyMarketValue: projectedState.moneyMarketBalance,
        investmentsValue,
        landValue,
        totalMembers: projectedState.members.filter(m => m.isActive).length,
      });
    }
  }
  
  return results;
}

// Calculate total contributions
export function getTotalContributions(state: FundState): number {
  return state.contributions.reduce((sum, c) => sum + c.amount, 0);
}

// Get total land value
export function getTotalLandValue(state: FundState): number {
  return state.landAssets
    .filter(l => l.status === 'held')
    .reduce((sum, l) => sum + l.currentValue, 0);
}

// Get unrealized gains
export function getUnrealizedGains(state: FundState): number {
  const totalContributed = getTotalContributions(state);
  return state.nav - totalContributed;
}

// Get month name
export function getMonthName(monthIndex: number, startDate: Date): string {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + monthIndex);
  return date.toLocaleDateString('en-NG', { month: 'short', year: 'numeric' });
}

// Get total expenses
export function getTotalExpenses(state: FundState): number {
  return (state.expenseRecords || []).reduce((sum, e) => sum + e.amount, 0);
}

// Get expenses by category
export function getExpensesByCategory(state: FundState): Record<string, number> {
  const result: Record<string, number> = {};
  
  (state.expenseRecords || []).forEach(expense => {
    if (!result[expense.category]) {
      result[expense.category] = 0;
    }
    result[expense.category] += expense.amount;
  });
  
  return result;
}

// Get monthly expense total (from settings)
export function getMonthlyExpenseTotal(state: FundState): number {
  return (state.expenseSettings || [])
    .filter(e => e.isActive && e.occurrence === 'monthly')
    .reduce((sum, e) => sum + e.amount, 0);
}

// Get yearly expense total (from settings)
export function getYearlyExpenseTotal(state: FundState): number {
  return (state.expenseSettings || [])
    .filter(e => e.isActive && e.occurrence === 'yearly')
    .reduce((sum, e) => sum + e.amount, 0);
}

// Get pending one-off expense total (active one-off expenses not yet deducted)
export function getOneOffExpenseTotal(state: FundState): number {
  return (state.expenseSettings || [])
    .filter(e => e.isActive && e.occurrence === 'one_off')
    .reduce((sum, e) => sum + e.amount, 0);
}

// Get investable cash (money market balance minus reserved expenses)
// Reserves at least the monthly expense amount + pending one-off expenses
export function getInvestableCash(state: FundState): number {
  const monthlyExpenses = getMonthlyExpenseTotal(state);
  const oneOffExpenses = getOneOffExpenseTotal(state);
  // Reserve for monthly expenses + any pending one-off expenses
  const reserved = monthlyExpenses + oneOffExpenses;
  return Math.max(0, state.moneyMarketBalance - reserved);
}

// Get expense reserve amount
export function getExpenseReserve(state: FundState): number {
  return getMonthlyExpenseTotal(state) + getOneOffExpenseTotal(state);
}

